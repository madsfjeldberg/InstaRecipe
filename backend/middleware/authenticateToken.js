import auth from '../auth.js';

async function authenticateToken(req, res, next) {

    const token = req.cookies.jwt;
    if(!token) {
        return res.status(401).send({ errorMessage: "Token missing from request"});
    }
    
    try {
        const user = await auth.verifyToken(token);
        if(!user) {
            return res.status(401).send({ errorMessage: "Invalid token"});
        }
        
        req.user = user;
        next();

    } catch(error) {
        console.error(error);
        return res.status(401).send({ errorMessage: "Authentication failed"});
    }
}

//burde kun bruges på /api/login, hvis man allerede er logget ind, og man clicker login burde man blive redirected direkte til dashboard.
async function isAuthenticated(req, res, next) {
    try{
        const jwt = req.cookies.jwt;
        if(!jwt) {
            return next();
        }

        const decodedJwt = await auth.verifyToken(jwt);
        const userId = decodedJwt.id;

        res
        .status(200)
        .send({
          id: userId,
          message: "Login successful.",
          status: 200,
        });

    } catch (error) {
        console.error(error);
        next();
    }
}

export { authenticateToken, isAuthenticated };