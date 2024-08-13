const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
        // const token = req.headers.authorization.split(" ")[1];
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({
                message:"Invalid authorization"
            })
        }
        req.user = decodedToken;
        next();
}

module.exports = isAuth;