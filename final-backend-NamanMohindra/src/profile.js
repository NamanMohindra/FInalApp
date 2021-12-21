const mongoose = require("mongoose");
const profileSchema = require("./profileSchema");
const connectionString = 'mongodb+srv://Naman:naman1@cluster0.w8and.mongodb.net/hw7?retryWrites=true&w=majority'
const Profile = mongoose.model('profile', profileSchema);
const uploadImage = require('./uploadCloudinary.js').uploadImage
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const getHeadline = (req, res) => {
  var users;
  if (req.params.users) {
    users = req.params.users.split(',')}
  else {
    users = [req.username];
  }
  
  connector.then(()=>{
    Profile.find({username: {$in: users}}).exec(function(err, profiles){
      var headlines = [];
      if (profiles.length === 0) {
        res.status(400).send("User not in database")
        return
      }
      profiles.forEach(x => {
        headlines.push({username : x.username, headline: x.headline})
      })
      res.status(200).send({headlines})
    })
  })
  
}

const putHeadline = (req, res) => {
  const username = req.username
  const headline = req.body.headline
  if (!headline ) {
    res.status(400).send('Headline not supplied')
  }
  connector.then(()=>{
    Profile.updateOne(
      {username: username},
      { $set: { headline: headline }},
      function(){
        res.status(200).send({username,headline});
      })
  })
  

}

const putEmail = (req,res) => {
  const username = req.username;
  const email = req.body.email
  
  if (!email ) {
    res.status(400).send('Email not supplied')
  }
  connector.then(()=>{
    Profile.findOne({username:username}).exec(function(err,doc){
      if (doc.email == email){
        res.sendStatus(409)
        return
      }
    else{
    Profile.findOneAndUpdate(
      {username: username},
      { $set: { email: email }},
      {new: true},
      function(err,doc){
        res.status(200).send({doc});
      })
  }})
})
}

const getEmail = (req,res) => {
  const username = req.params.user;
  
  connector.then(()=>{
    Profile.findOne({username}).exec(function(err, profiles){
    
      if (err || !profiles) {
        res.status(400).send("User not in database")
        return
      }
    
      res.status(200).send({username,emailAddress:profiles.email})
    })
  })
}

const getZipcode = (req,res) => {
  const username = req.params.user;
  connector.then(()=>{
    Profile.findOne({username}).exec(function(err, profiles){

      if (err || !profiles) {
        res.status(400).send("User not in database")
        return
      }
      res.status(200).send({username,zipcode:profiles.zipcode})
    })
  })
}

const putZipcode = (req,res) => {
  const username = req.username;
  const zipcode = req.body.zip
  
  if (!zipcode ) {
    res.status(400).send('Zipcode not supplied')
  }
  connector.then(()=>{
    Profile.findOne({username:username}).exec(function(err,doc){
      if (doc.zipcode == zipcode){
        res.sendStatus(409)
        return
      }
    else{
    Profile.findOneAndUpdate(
      {username: username},
      { $set: { zipcode: zipcode }},
      {new: true},
      function(err,doc){
        res.status(200).send({doc});
      })
  }})
})
}
const putPhone = (req,res) => {
  const username = req.username;
  const phone = req.body.phone
  
  if (!phone ) {
    res.status(400).send('Phone not supplied')
  }
  connector.then(()=>{
    Profile.findOne({username:username}).exec(function(err,doc){
      if (doc.phone == phone){
        res.sendStatus(409)
        return
      }
    else{
    Profile.findOneAndUpdate(
      {username: username},
      { $set: { phone: phone }},
      {new: true},
      function(err,doc){
        res.status(200).send({doc});
      })
  }})
})
}

const getDOB = (req,res) => {
  const username = req.params.user;
  connector.then(()=>{
    Profile.findOne({username}).exec(function(err, profiles){

      if (err || !profiles) {
        res.status(400).send("User not in database")
        return
      }
      res.status(200).send({username,dob:profiles.dob})
    })
  })
}

const getAvatar = (req,res) => {
  const username = req.params.user;
  connector.then(()=>{
    Profile.findOne({username}).exec(function(err, profiles){

      if (err || !profiles) {
        res.status(400).send("User not in database")
        return
      }
      res.status(200).send({username,avatar:profiles.avatar})
    })
  })
}

const putAvatar = (req,res) => {
  const username = req.username;
  const avatar = req.fileurl

  if (!avatar ) {
    res.status(400).send('Avatar not supplied')
  }

  connector.then(()=>{
    Profile.updateOne(
      {username: username},
      { $set: { avatar:avatar}},
      function(){
        res.status(200).send({username,avatar});
      })
  })
  }


const getProfile = (req,res) => {
    const username = req.username
    connector.then(()=>{
      Profile.findOne({username}).exec(function(err, profile) {


      res.send({username:profile.username,headline:profile.headline,following:profile.following,
        email:profile.email,zipcode:profile.zipcode,dob:profile.dob,
        avatar:profile.avatar,phone:profile.phone,displayName:profile.displayName})
    })
  })
}


const getFullProfile = (req, res) => {
  const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  connector.then(() => {
      Profile.findOne({username: req.params.user}, function(err, data) {
          if(data) {
              res.send({profile: data})
          } else {
              res.sendStatus(404);
          }
      })
  })
}


const putProfile = (req,res) =>{
  const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  const username = req.username
  const email = req.body.email
  const phone = req.body.phone
  const zip = req.body.zipcode
  
  connector.then(()=>{
    Profile.updateOne(
      {username: username},
      { $set: {email:email,phone:phone,zipcode:zip}},
      function(){
        
        res.status(200).send({email,phone,zip});
      })
})
}
module.exports = app => {

  app.get('/headline/:users?', getHeadline)
  app.put('/headline', putHeadline)
  app.get('/zipcode/:user?', getZipcode)
  app.put('/zipcode', putZipcode)
  app.get('/email/:user?', getEmail)
  app.put('/email', putEmail)
  app.put('/phone',putPhone)
  app.get('/dob/:user?',getDOB)
  app.get('/avatar/:user?', getAvatar)
  app.put('/avatar', uploadImage('image'),putAvatar)
  app.get('/profile',getProfile)
  app.get('/profile/:user?', getFullProfile);
  app.put('/profile',putProfile)

}
