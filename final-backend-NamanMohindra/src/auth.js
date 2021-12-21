const md5 = require('md5')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const connectionString = 'mongodb+srv://Naman:naman1@cluster0.w8and.mongodb.net/hw7?retryWrites=true&w=majority'
const userSchema = require("./userSchema");
const User = mongoose.model('user', userSchema);
const profileSchema = require("./profileSchema");
const Profile = mongoose.model('profile', profileSchema);

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var cookieKey = 'sid'
const mySecretMessage = "rice"
const redis = require('redis').createClient('redis://:p478c82312c7c8af573d9813ae31722c42831832de6b43f4f1b45d2690e34004e@ec2-3-220-161-139.compute-1.amazonaws.com:19899')
const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const baseURL = "https://shut-teeth.surge.sh"
//const baseURL = "http://localhost:3000"
function isLoggedIn(req, res, next) {
  console.log(req.cookies)
  if (!req.cookies) {
    
    return res.status(401);
  }
  const sid = req.cookies[cookieKey]
  if(!sid){
    console.log('hi')
    //console.log(req.cookies,1)
    return res.sendStatus(401)
  }

  redis.hmget('sessions',sid, function(err, obj){
    if (obj[0]!==null) {
      req.username = JSON.parse(obj).username
      next()
    }
    else{
      res.status(401).send('Session does not exist')
    }
  })
}

const register = (req, res) => {
  let username = req.body.username;
  
  connector.then(()=> {
    User.findOne({username: username}, function (err, doc) {
      if (doc) {
        res.sendStatus(409);
      } else {
        let password = req.body.password;
        
        // supply username and password
        if (!username || !password) {
          return res.sendStatus(400);
        }
        var salt = 'riceuniversity';
        var hash = md5(password + salt)
        connector.then(()=> new User({
          username: username,
          salt: salt,
          hash: hash,
        }).save());
        connector.then(()=> new Profile({
          email: req.body.email,
          zipcode: req.body.zipcode,
          username: username,
          dob: req.body.dob,
          headline: "Hey I am " + username + ". I am new to InstaBook",
          avatar: req.body.avatar,
          phone:req.body.phone
        }).save().then(data => {
          let sid = md5(username + Date.now);
          redis.hmset('sessions', sid, JSON.stringify({
            "username": username,
            "salt": salt,
            "userId": data.userId,
            "hash": hash
          }));
          res.cookie(cookieKey, sid, {maxAge: 3600 * 1000,httpOnly: true,secure: true, sameSite: 'none'});
          let msg = {username: username, result: 'success'};
          res.send(msg);
        }));
      }
    })
  });
}

passport.serializeUser(function(user,done){
  done(null,user);
})

passport.deserializeUser(function(user,done){
  done(null,user);
})

passport.use(new GoogleStrategy({
  clientID: '954593888658-80mqivopmu1usqpthfh4jm1kh7u579n6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "/auth/google/callback"
},
  function(accessToken, refreshToken, profile, done) {
  
      let user = {
          'email':profile.emails[0].value,
          'name' : profile.name.givenName + ' ' + profile.name.familyName,
          'id'   : profile.id,
          'token': accessToken
      };
      const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      
      connector.then(()=>{
        Profile.findOne({gid:profile.id}, function(err,doc){
          
          if(!doc){
            new Profile({
              gid:profile.id,
              email:profile.emails[0].value,
              username:profile.name.givenName + ' ' + profile.name.familyName,
              googleUsername: profile.name.givenName,
              following:[],
              avatar:profile.photos[0].value,
              headline: 'Hello google User, I am new to InstaBook!'

            }).save(function(err,doc){
              return done(null,user)
            })
          }
        })
      })
      return done(null, user);
  })
);


function loginWithGoogle(req, res) {
  let gid = req.body.id;
  const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  connector.then(() => {
      Profile.findOneAndUpdate({gid: gid},{gid: gid}, {upsert: false},function(err, doc) {
          if(doc) {
              let sid = md5(doc.username + Date.now);
              redis.hmset('sessions', sid, JSON.stringify({
                  "username": doc.username,
                  "userId": doc.userId
              }));
              res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, httpOnly: true,secure: true, sameSite: 'none'});//, secure: true, sameSite: 'none'
              // req.session.username = req.body.username;
              let msg = {username: doc.username, result: 'success'};
              res.send(msg);
          } else {
              res.sendStatus(401)
          }
      })
  })
}



const login = (req, res) => {
  var username = req.body.username
  var password = req.body.password
  if(!username || !password) {
    res.status(400).send("Please enter username and password")
    return
  }

  User.findOne({username: username}).exec(function(err, users) {
    if (!users) {
      res.status(401).send("User is not registered yet.")
      return
    }

    if(users) {
      const userObj = users
      const hash = userObj.hash
      const salt = userObj.salt

      const newhash = md5(password + salt)

      if (newhash !== hash) {
        res.status(403).send("Password is incorrect, Try again!")
      } else {
        const sessionKey = md5(mySecretMessage + userObj.username + Date.now())

        redis.hmset('sessions',sessionKey, JSON.stringify(userObj))
        res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000,secure: true, sameSite: 'none',httpOnly:true})

        const msg = { username, result: 'success'}
        res.send(msg)
      }
    } else {
      res.sendStatus(404)
    }
  })
}


const logout = (req, res) => {
  // deleting the redis session and clearing the cookie
  const sid = req.cookies[cookieKey]
  redis.hdel('sessions',sid)
  res.clearCookie(cookieKey)
  res.status(200).send('OK')
}

// stub for put /password
const putPassword = (req,res) => {
  
  const username = req.username
  const password = req.body.password
  var salt = 'riceuniversity';
  var hash = md5(password + salt)
  connector.then(()=>{
   User.findOneAndUpdate({username:username},{
    salt: salt,
    hash: hash,
   },{upsert:false},function(err,doc){
     if(err){
       res.sendStatus(500);
     }
     else{
       res.send({password:"Password has been updated"})
     }
   })
  })
}


module.exports = (app) => {
  app.use(cookieParser());
  app.use(
    session({
      secret:'doNotGuessTheSecret',
      resave:true, 
      saveUninitialized:true
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email', ] }));
  app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: `${baseURL}/login`,
        }),
        function (req, res) {
            res.redirect(`${baseURL}/LoginWithGoogle/` + req.user.id)
        });
  app.post('/auth/google/login', loginWithGoogle);

  app.post('/register', register)
  app.post('/login', login)
  app.use(isLoggedIn)
  app.put('/password', putPassword)
  app.put('/logout', logout)
}
