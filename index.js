import { toJson } from 'unsplash-js'

const express       =        require("express"),
      app           =        express(),
      bodyParser    =        require("body-parser"),
      mongoose      =        require("mongoose"),
      cloudinary    =        require("cloudinary"),
      unsplash      =        require("./lib/unsplash"),
      Wallpaper     =        require("./models/wallpaper"),
      User          =        require("./models/user"),
      fetch         =        require("node-fetch"),
      firebase      =        require('firebase'),
      url           =        require("url")

      
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://cdong1995:dc196828zxzqzl@ds125453.mlab.com:25453/wallpaper-ase');
cloudinary.config({ 
    cloud_name: 'candong', 
    api_key: 823243289597989, 
    api_secret: '0F1l-otQXSMbnZrj8OQQRZiEEI0'
});

let firebaseConfig = {
    apiKey: "AIzaSyAqgXt5GvALuuw2H6bXmS45_rU07z8Iy0E",
    authDomain: "wallpater-ase.firebaseapp.com",
    databaseURL: "https://wallpater-ase.firebaseio.com",
    projectId: "wallpater-ase",
    storageBucket: "wallpater-ase.appspot.com",
    messagingSenderId: "412954877097"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(User => {
  if(User){
    Uid = User.uid; 
    console.log("Current: " + User.uid);
  }
})

var Uid 

app.get('/wallpapers/index', (req, res) => {
    Wallpaper.find({}, function(err, allWallpapers) {
      if(err) console.log(err)
      else {
          res.send(allWallpapers)
      }
    })   
})

app.get('/wallpapers/likes', (req, res) => {
    User.findOne({uid:Uid}).populate("likePics").exec(function(err, wallpapers){     
      if(err) console.log(err)
      else {
          res.send(wallpapers.likePics)
      }
    })   
})

app.post('/addLike', (req, resp) => {
  var wid=req.body.wid
  User.findOne({uid: Uid},function(err,res){
    console.log(res.likePics)
    if(res.likePics.indexOf(wid)<0){
      User.findOneAndUpdate({uid: Uid},
        {$push: {likePics: wid}}, function(err, user){
          if(err) console.log(err)
          else {
            console.log(Uid + " likes this picture");
          }
        });
      
      Wallpaper.findOneAndUpdate({_id: wid},
        {$inc: {likes: 1}}, function(err, user){
            if(err) console.log(err)
            else {
              console.log("success")
              resp.send("success")
            }
        });
    }  
  });   
})

app.post('/addCollect', (req, resp) => {
  var wid=req.body.wid
  User.findOne({uid: Uid},function(err,res){
    console.log(res.collectPics)
    if(res.collectPics.indexOf(wid)<0){
      User.findOneAndUpdate({uid: Uid},
        {$push: {collectPics: wid}}, function(err, user){
          if(err) console.log(err)
          else {
            console.log(Uid + " collects this picture");
          }
        });
      
      Wallpaper.findOneAndUpdate({_id: wid},
        {$inc: {collects: 1}}, function(err, user){
            if(err) console.log(err)
            else {
              console.log("success")
              resp.send("success")
            }
        });
    }  
  });   
})

app.get('/wallpapers/collections', (req, res) => {
    User.findOne({uid:Uid}).populate("collectPics").exec(function(err, wallpapers){     
      if(err) console.log(err)
      else {
          res.send(wallpapers.collectPics)
      }
    })    
})

app.get('/wallpapers/upload', (req, res) => {
    User.findOne({uid:Uid}).populate("uploadPics").exec(function(err, wallpapers){     
      if(err) console.log(err)
      else {
        res.send(wallpapers.uploadPics)
      }
    })   
})

app.get('/search', (req, res) => {
    let keyword = 'dog'
    unsplash.search.photos(keyword, 1, 20)  
        .catch(err => {
            console.log(err);
        })
        .then(toJson)
        .then(json => {
            res.send(json)
        });    
})

app.post('/login', (req, res) => {
  console.log(req.query)
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function(){
    console.log("Login Success")
    res.send("successful");
  }).catch(function(error){
    if(error != null){
      console.log(error.message);
    }
  });    
})

app.post('/register', (req, res) => {
  console.log(req)
  console.log(req.body)
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function(userData){
    console.log('Register Success');
    let newUser = {uid : userData.user.uid}
    User.create(newUser, (err, user) => {
        if(err) console.log(err)
        else {
          console.log("Successfully add: " + user.uid)
          res.send("successful")
        }
    })
  }).catch(function(error){
    if(error != null){
      console.log(error.message);
      return;
    }
  });    
})

app.post('/upload', (req, res) => {
  let newWallpaper = {_id: new mongoose.Types.ObjectId(), url : req.body.url}
  Wallpaper.create(newWallpaper, function(err, wallpaper){
    if(err) console.log(err)
    else{
        User.findOneAndUpdate({uid: Uid},
          {$push: {uploadPics: wallpaper._id.toString()}}, function(err, user){
            if(err) console.log(err)
            else {
              console.log(user)
              res.send('succussfully upload')
            }
          });
    }
    })
})

app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen("8000", function(){
   console.log("API service started!"); 
});