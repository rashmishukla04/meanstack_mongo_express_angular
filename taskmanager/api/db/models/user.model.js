const mongoose=require("mongoose");
const lodash=require('lodash')
const jwt=require('jsonwebtoken');
const crypto=require('crypto')
const bcrypt=require("bcryptjs")

const jwtsecret="16961477345433709260sj98mlo7298347044";

const userschema= mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1

    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    sessions:[{token:{
        type:String,
        required:true
    },
        expiresAt:{
            type:Number,
            required:true
        }}]
})

userschema.methods.toJSON=function(){
    const user=this;
    const userobject=user.toObject();
    return lodash.omit(userobject,['password','sessions'])
}

userschema.methods.generateAccessAuthToken=function(){
    const user=this;
    return new Promise((resolve,reject)=>{
        jwt.sign({_id:user._id.toHexString()},jwtsecret,{expiresIn:'15m'},(err,token)=>{
            if(!err){
                    resolve(token);
            }else{
                    reject();
            }
        })
    }
    )
}
userschema.methods.createsession=function(){
    user=this;

    return user.generateRefreshAuthToken().then((refreshToken)=>{
        return saveSessionToDatabase(user,refreshToken);
    }).then((refreshToken)=>{
        return refreshToken;
    }).catch((e)=>{
        Promise.reject("Failed to save session to DB",e);
    })
}

let saveSessionToDatabase=(user,refreshToken)=>{
    return new Promise((resolve,reject)=>{
        let expiresat=generatefreshTokenExpiryTime();
        user.sessions.push({"token":refreshToken, "expiresAt":expiresat})
        user.save().then(()=>{
            return resolve(refreshToken);
        }).catch((e)=>{
                return reject(e);
        })
    })

}


userschema.methods.generateRefreshAuthToken=function(){
    return new Promise((resolve,reject)=>{
        crypto.randomBytes(64,(err,buf)=>{
            if(!err){
                let token=buf.toString('hex');
                return resolve(token);
            }
        })
    })
}

let generatefreshTokenExpiryTime=()=>{
    let daysuntilexpires="10"
    let seconduntilexpires=((daysuntilexpires*24)*60)*60;
    return ((Date.now()/1000)+seconduntilexpires);
}

//