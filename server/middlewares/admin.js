const isAdmin = async(req, res, next) => {
        if(!req.user.isAdmin){
            return res.status(401).json({
                message:"User is not an administrator"
            })
        }
        next();
}

module.exports = isAdmin;