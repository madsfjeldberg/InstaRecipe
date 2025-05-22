import auth from '../service/authService.js';

import usersRepository from '../repository/usersRepository.js';

const authenticateToken = async (req, res, next) => {

    const token = req.cookies.jwt;
    if(!token) {
        return res.status(401).send({ errorMessage: "Token missing from request"});
    }
    
    try {
        const user = await auth.verifyToken(token);
        if(!user) {
            return res.clearCookie("jwt").status(401).send({ errorMessage: "Invalid token" });
        }
        
        req.user = user;
        next();

    } catch(error) {
        console.error(error);
        return res.status(401).send({ errorMessage: "Authentication failed"});
    }
}

//burde kun bruges på /api/login, hvis man allerede er logget ind, og man clicker login burde man blive redirected direkte til explore.
const isAuthenticated = async (req, res, next) => {
    try{
        const jwt = req.cookies.jwt;
        if(!jwt) {
            return next();
        }

        const decodedJwt = await auth.verifyToken(jwt);
        const user = await usersRepository.getUserById(decodedJwt.id)

        res.send({ data: user});

    } catch (error) {
        console.error(error);
        next();
    }
}

const authMiddleware = {
    authenticateToken,
    isAuthenticated
};

export default authMiddleware;
