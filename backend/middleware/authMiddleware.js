import 'dotenv/config'

import auth from '../util/auth.js';

const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if(!accessToken) {
        return res.status(401).send({ errorMessage: "Token missing from request"});
    }
    
    try {
        const decodedToken = await auth.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();

    } catch(error) {
        console.error(error);
        return res.status(401).send({ errorMessage: "Authentication failed"});
    }
}

const authMiddleware = {
    authenticateToken
};

export default authMiddleware;
