import 'dotenv/config';
import { Router } from "express";
import auth from "../service/authService.js";
import emailService from "../service/emailService.js";
import prisma from "../database/prismaClient.js";
import redis from '../database/redisClient.js';
import { authenticateToken, isAuthenticated } from '../middleware/authenticateToken.js';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 3600000, // 1 hour
  path: "/"
}

router.post("/api/auth/register", async (req, res) => {
  // extract user data from request body
  const { username, email, password } = req.body;

  // validate user data
  if (!username || !email || !password) {
    return res.status(400).send({ status: 400, message: "All fields are required" });
  }
  // check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(400).send({ status: 400, message: "Username already exists" });
  }
  // check if email already exists
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return res.status(400).send({ status: 400, message: "Email already exists" });
  }

  const hashedPassword = await auth.hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  //this generates the token and stroes userId as value and token as key
  const jwt = await auth.generateToken(newUser);
  await emailService.sendVerificationEmail(newUser.email, jwt);

  res.cookie("jwt", jwt, cookieOptions).send({ message: "User registered successfully.", status: 200 });
});

router.post("/api/auth/login", isAuthenticated, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("All fields are required");
    return res.status(400).send({ message: "All fields are required" });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    console.log("User not found");
    return res.status(401).send({ message: "Wrong username or password." });
  }
  if (!user.isConfirmed) {
    console.log("User not confirmed");
    return res.status(401).send({ message: "Please confirm your email first." });
  }
  const isValidPassword = await auth.verifyPassword(password, user.password);

  try {
    if (isValidPassword) {
      const accessToken = await auth.generateToken(user);
      const refreshToken = await auth.generateRefreshToken(user);
      await redis.setEx(`refresh:${refreshToken}`, 604800, user.id.toString());

      res
        .status(200)
        .cookie("jwt", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, {
          ...cookieOptions,
          maxAge: 604800000, // 7 days
        })
        .send({
          id: user.id,
          message: "Login successful.",
          status: 200,
        });
    } else {
      console.log("Wrong username or password.");
      return res.status(401).send({ message: "Wrong username or password." });
    }
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occurred during login.", error: e.message });
  }
});


router.get("/api/auth/logout", async (req, res) => {
  
  const jwt = req.cookies.jwt;
  if(!jwt) {
    return res.status(404).send({ errorMessage: "no tokens found on request"})
  }


  const isDestroyed = await auth.destroyToken(jwt);
  if(!isDestroyed) {
    return res.status(404).send({ errorMessage: "error occurred during logout"})
  }

  await redis.del(`refresh:${req.cookies.refreshToken}`);
  res
    .clearCookie("refreshToken")
    .clearCookie("jwt")
    .status(200)
    .send({ message: "Logout successful." });
});


router.post("/api/auth/change-password", async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const token = req.cookies.jwt;
  const decoded = auth.decodeToken(token);
  const dbUser = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!dbUser) {
    return res.status(401).send({ message: "User not found" });
  }

  try {
    const hashedPassword = await auth.hashPassword(newPassword);
    await editUser(dbUser._id, dbUser.username, dbUser.email, hashedPassword);
    res.status(200).send({ message: "Password changed successfully" });
  } catch (e) {
    res.status(500).send({ message: `An error occurred during password change.` });
  }
});



router.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  if(!email) {
    return res.status(401).send({ errorMessage: "Email must be included in the request"});
  }

  try{

    const isValidEmail = await prisma.user.findUnique({ 
      where: {
        email: email
      }
    });
    if(!isValidEmail) {
      return res.status(401).send({ errorMessage: "Invalid email"});
    }
    
    const foundToken = await redis.exists(email);
    if(foundToken) {
      try{
        await redis.del(email);
      }catch(error) {
        console.error(error);
        return res.status(500).send({ errorMessage: "Error occurred during token reset password token deletion"})
      }
    }

    const resetToken = crypto.randomUUID();
    const FIFTEEN_MINUTES = 900;
    const isSet = await redis.setEx(resetToken, FIFTEEN_MINUTES, email);
    if(!isSet) {
      return res.status(500).send({ errorMessage: "Something went wrong generating reset password token"});
    }

    await emailService.sendPasswordResetEmail(email, resetToken);
    res.send({ status: 200, message: "Forgot password request processed successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Something went wrong processing forgot-password request"})
  }
})



router.patch("/api/auth/reset-password/:token", async (req, res) => {
  const resetToken = req.params.token;
  if(!resetToken) {
    return res.status(401).send({ errorMessage: "Reset token must be included in the request"});
  }

  
  const { newPassword } = req.body;
  if(!newPassword) {
    return res.status(401).send({ errorMessage: "must include a new password"});
  }

  try{
    const doesExists = await redis.exists(resetToken);
    if(!doesExists) {
      return res.status(401).send({ errorMessage: "No reset token found, send a new forgot password request"})
    }

    const email = await redis.get(resetToken);

    const isDeleted = await redis.del(resetToken);
    if(!isDeleted) {
      return res.status(500).send({ errorMessage: "Error occurred when deleting reset token"});
    }

    const newHashedPassword = await auth.hashPassword(newPassword);
    await prisma.user.update({ 
      where: {
        email: email
      },
      data: {
        password: newHashedPassword
      }
    });

    res.send({ status: 200, message: "Password has been reset"});


  } catch (error) {
    res.status(500).send({ errorMessage: "Unexpected error occurred during password reset"})
    console.error(error);
  }

})



router.get("/api/auth/verify/:token", authenticateToken, async (req, res) => {
  const user = req.user;

  try {

    await prisma.user.update({
      where: {
        username: user.username
      },
      data: {
        isConfirmed: true
      }
    });

    return res.status(200).send({
      status: 200,
      message: "Account verified successfully."
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Somehting went wrong conforming the email" })
  }

});

router.post("/api/auth/refresh", async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    return res.status(401).send({ errorMessage: "Refresh token missing" });
  }

  try {
    const userId = await redis.get(`refresh:${oldRefreshToken}`);
    if (!userId) {
      return res.status(403).send({ errorMessage: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).send({ errorMessage: "User not found" });
    }

    // Generate new tokens
    const newAccessToken = await auth.generateToken(user, "15m");
    const newRefreshToken = await auth.generateRefreshToken(user);

    // Store new refresh token, and delete the old one
    await redis.multi()
      .del(`refresh:${oldRefreshToken}`)
      .setEx(`refresh:${newRefreshToken}`, 7 * 24 * 60 * 60, user.id.toString()) // 7 days
      .exec();

    // Send new tokens back
    res
      .cookie("jwt", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 604800000, // 7 days
      })
      .send({ status: 200 });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Failed to refresh token" });
  }
});

export default router;
