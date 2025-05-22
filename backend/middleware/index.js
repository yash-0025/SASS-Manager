const jwt = require('jsonwebtoken')
require('dotenv').config()


// const JwtDecoder = (req,res,next) => {
//     try{
//         if(!req.headers.authorization) return res.status(400).json({
//             error: "Token Not found"
//         })
//         const data = jwt.decode(req.headers.authorization)
//         console.log(data)
//         req.user = data;
//         next()
//     } catch(error) {
//         res.status(500).json({error})
//     }
// }

const JwtDecoder = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization header missing or malformed" });
        }

        const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
        const decoded = jwt.decode(token); // or use jwt.verify(token, secret) for validation

        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = decoded; // attach to request object
        next();
    } catch (error) {
        res.status(500).json({ error: "Error decoding token: " + error.message });
    }
};

const CorsHeader=(req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    
    res.setHeader("Access-Control-Max-Age", 7200);
    next();
};


module.exports = {JwtDecoder,CorsHeader};