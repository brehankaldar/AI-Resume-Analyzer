const env=require("../config/env");
const ApiError=require("../utils/ApiError");
const User=require("../models/User");
const {verifyToken}=require("../utils/jwt");

async function requireAuth(req,res,next){
    try{
        const token=req.cookies?.[env.cookieName];
        if(!token) throw ApiError.unauthorized();

        const payload=verifyToken(token);
        const user=await User.findById(payload.sub);
        if(!user) throw ApiError.unauthorized("session expired");
        req.user=user;
        next();
    } catch (err) {
        if (err.name==="JsonWebTokenError"||err.name==="TokenExpiredError"){
            return next(ApiError.unauthorized("Invalid or expired token"));
        }
        next(err);
    }
}
module.exports={requireAuth};