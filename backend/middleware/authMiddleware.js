import 'dotenv/config'

import auth from '../util/auth.js';

import usersRepository from '../repository/usersRepository.js';

const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if(!accessToken) {
        return res.status(401).send({ errorMessage: "Token missing from request"});
    }
    
    try {
        const decodedToken = await auth.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECERET);
        if(!decodedToken) {
            return res.status(401).send({ errorMessage: "Invalid token" });
        }
        
        req.user = decodedToken;
        next();

    } catch(error) {
        console.error(error);
        return res.status(401).send({ errorMessage: "Authentication failed"});
    }
}

//burde kun bruges på /api/login, hvis man allerede er logget ind, og man clicker login burde man blive redirected direkte til explore.
const isAuthenticated = async (req, res, next) => {
    try{
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1];

        if (!accessToken) {
            return next();
        }

        const decodedJwt = await auth.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECERET);
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
