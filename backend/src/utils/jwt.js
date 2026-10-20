const jwt=require('jsonwebtoken');
const env=require('../config/env');

function signToken(payload) {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
}

const cookieOptions = {
    httpOnly: true,
    secure: env.isProd, // Use secure cookies in production
    sameSite: env.isProd ? 'None' : 'Lax', // Adjust based on your needs
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path:'/',
};
module.exports = {
    signToken,
    verifyToken,
    cookieOptions,
};