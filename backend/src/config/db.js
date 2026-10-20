const mongoose = require('mongoose');
const env=require('./env');
mongoose.set('strictQuery', true);
async function connectDB() {
    const conn = await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 10_000, // 5 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err}`);
        
    });
    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
       
        });
    };
    module.exports = {connectDB};
