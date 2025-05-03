import auth from '../auth.js';

async function authenticateToken(req, res, next) {

    // this should only be set if we go the pure CSR and not both CSR and SSR
    // const authHeader = req.headers["Authorization"];
    // if(!authHeader) {
    //     return res.status(401).json({ errorMessage: "Missing authorization header" });
    // }

    // const token = authHeader.split(' ')[1];
    // if (!token) {
    //     return res.status(401).json({ errorMessage: "Token missing" });
    // }

    const token = req.cookies.jwt;

    try {
        const user = await auth.verifyToken(token);
        req.user = user;

        next();
    } catch(error) {
        console.error(error);
        return res.status(401).send({ errorMessage: "Authentication failed"});
    }
}

export { authenticateToken };