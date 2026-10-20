const {rateLimit,ipKeyGenerator} = require('express-rate-limit');

const analyzerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5,           // limit each IP to 5 requests per windowMs
    standardHeaders:"draft-7", // Return rate limit info in the `RateLimit-*
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator:(req,res)=>
        req.user?._id?.toString()|| ipKeyGenerator(req,res),
        message:{
            error:{message:"Too many analyses, please try again later."}
  }});

const authLimiter = rateLimit({
    windowMs:15 * 60 * 1000, // 15 minutes
    limit: 30,           // limit each IP to 30 requests per windowMs
    standardHeaders:"draft-7", // Return rate limit info in the `RateLimit-*
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator:(req,res)=> ipKeyGenerator(req,res),
        message:{
            error:{message:"Too many auth attempts, please try again later."}
  }});

module.exports={analyzerLimiter, authLimiter}
