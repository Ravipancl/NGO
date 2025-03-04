const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")

function userMiddleware(req, res, next){

    // get token from cookies
    const token = req.cookies.token;

    // if no token provided tell them they are unauthorized and do login/signup
    if(!token){
        return res.status(401).json({
            message: "Unauthorized, do Login/Signup"
        });
    }

    // if token provided then verify if verification fail respond with invalid token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid Token"
        });
    }

}

module.exports = {
    userMiddleware
}