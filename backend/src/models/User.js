const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please provide a valid email address"],
        index:true,
    },
    passwordHash:{
        type:String,
        required:true,
        select:false,
    },
    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:80},},
{timestamps:true});
userSchema.statics.hashPassword=function(plain){
    return bcrypt.hash(plain,12);
}
userSchema.methods.comparePassword=function(plain){
    return bcrypt.compare(plain,this.passwordHash);
}

userSchema.methods.toJSON=function(){
    const obj=this.toObject();
    delete obj.passwordHash;
    delete obj.__v;
    return obj;
}
module.exports=mongoose.model('User',userSchema);