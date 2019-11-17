const bcrypt =require("bcryptjs")
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema= new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory":{
       "dateTime":Date,
       "userAgent": String
    }
})
let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://flosi:simbas123@ds127892.mlab.com:27892/bti325_a6");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser= function(userData){
    return new Promise(function (resolve, reject){
        console.log("in reg user")
        if (userData.password.length==0 || userData.password2.length==0){
            reject("Password cannot be empty or white spaces ")
        }else{
            if (userData.password!=userData.password2){
                reject("passwords do notmatch")
            }
            else{
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(userData.password, salt, function(err, hash) {
                        userData.password=hash;
                        let newUser= new User(userData);
                        newUser.save((err)=>{
                         if (err){
                            if (err.code==11000){
                                reject("User Name Taken")
                            } else if (err.code!=11000){
                                reject("There was an error creating the user:" +err);
                            }
                        }else {
                            resolve();
                        }
                    })
                });
                });
            }
        }
    });
}

module.exports.checkUser= function(userData){
    return new Promise (function(resolve,reject){
    User.findOne({userName: userData.userName})
        .exec()
        .then((foundUser)=>{
            if (!foundUser){
                console.log("unable to find user")
                reject("1.unable to find user:"+ userData.userName);
            }
            else{
                bcrypt.compare(userData.password, foundUser.password).then((res) => {
                    if (res== true){
                        console.log("user found")
                        foundUser.loginHistory={dateTime: (new Date()).toString(), userAgent: userData.userAgent};
                        User.update({userName: foundUser.userName},
                            {$set:{loginHistory: foundUser.loginHistory}})
                            .exec()
                        .then(()=>{
                            console.log("updateSuccess")
                            resolve(foundUser)})
                        .catch((err)=>{
                            reject("Error verifying user: "+err)
                        })
                    } else if (res==false){
                        reject("2.Unable to find user:"+ userData.userName)
                    }
                });
                
                }
        })
        .catch(()=>{
            reject("3.Unable to find user: "+ userData.userName);
        })
    }) 
}

