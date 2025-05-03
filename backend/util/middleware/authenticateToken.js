import verifyToken from '../auth.js';

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["athorization"];
    if(!authHeader) {
        return res.status(401).json({ errorMessage: "Missing authorization header" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ errorMessage: "Token missing" });
    }

    try {
        const user = await verifyToken(token);
        req.user = user;

        next();
    } catch(error) {
        console.error(error);
        return res.status(401).send({ errorMessage: "Authentication failed"});
    }
}

export { authenticateToken };