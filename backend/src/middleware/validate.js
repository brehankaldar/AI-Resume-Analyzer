const ApiError = require("../utils/ApiError");
const validate=(schema,source='body')=>async(req,res,next)=>{
    const result=schema.safeParse(req[source]);
    if(!result.success){
        return next(ApiError.badRequest("Validation failed",{details:result.error.issues}));
    }
    req[source]=result.data;
    next();
}
module.exports={validate}