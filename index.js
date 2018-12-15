const express       =        require("express"),
      app           =        express(),
      bodyParser    =        require("body-parser"),
      mongoose      =        require("mongoose"),
      cloudinary    =        require("cloudinary"),
      Wallpaper     =        require("./models/wallpaper"),
      User          =        require("./models/user"),
      fetch         =        require("node-fetch"),
      firebase      =        require('firebase'),
      url           =        require("url")


app.use(bodyParser.json({limit: '60mb'}));
app.use(bodyParser.urlencoded({limit: '60mb', extended: true}));

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
   function A(){
     return new Promise((resolve, reject) => {
      if(err) console.log(err)
      else {
          console.log("all is"+allWallpapers)
          User.findOne({uid:Uid}).exec(function(err, likes){
            if(err) console.log(err)
            else{
              for(var i = 0; i < allWallpapers.length; i++) {
                let isLiked=likes.likePics.some((item)=>{
                  return item.toString() === allWallpapers[i]._id.toString();})
                let isCollected=likes.collectPics.some((item)=>{
                  return item.toString() === allWallpapers[i]._id.toString();})
                allWallpapers[i]["isLiked"]=isLiked
                allWallpapers[i]["isCollected"]=isCollected
                console.log("is collect"+isCollected)
              }
            } 
             resolve();         
          })        
      }
     }

     )}

     async function init(){
       await A();
       res.send(allWallpapers)
     }
     init()
   })   
})


app.get('/wallpapers/likes', (req, res) => {
    // User.findOne({uid:Uid}).populate("likePics").exec(function(err, wallpapers){     
    //   if(err) console.log(err)
    //   else {
    //       res.send(wallpapers.likePics)
    //   }
    // })
    User.findOne({uid:Uid}).populate("likePics").exec(function(err, wallpapers) {
      function A(){
        return new Promise((resolve, reject) => {
         if(err) console.log(err)
         else {
             console.log("all is"+wallpapers.likePics)
             User.findOne({uid:Uid}).exec(function(err, likes){
               if(err) console.log(err)
               else{
                 for(var i = 0; i < wallpapers.likePics.length; i++) {
                   let isLiked=likes.likePics.some((item)=>{
                     return item.toString() === wallpapers.likePics[i]._id.toString();})
                   let isCollected=likes.collectPics.some((item)=>{
                     return item.toString() === wallpapers.likePics[i]._id.toString();})
                     wallpapers.likePics[i]["isLiked"]=isLiked
                     wallpapers.likePics[i]["isCollected"]=isCollected
                   console.log("is collect"+isCollected)
                 }
               } 
                resolve();         
             })        
         }
        }
   
        )}
   
        async function init(){
          await A();
          res.send(wallpapers.likePics)
        }
        init()
      })          
})

app.post('/addLike', (req, resp) => {
  var wid = req.body.wid
  var action = req.body.action
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
      }else{
        User.findOneAndUpdate({uid: Uid},
          {$pull: {likePics: wid}}, function(err, user){
            if(err) console.log(err)
            else {
              console.log(Uid + " likes this picture");
            }
          });
      }
      Wallpaper.findOneAndUpdate({_id: wid},
        {$inc: {likes: action}}, function(err, user){
          console.log("action is "+action)
            if(err) console.log("error is"+err)
            else {
              console.log("action is "+action)
              console.log("success")
              resp.send("success")
            }
        }); 
  });   
})

app.post('/addCollect', (req, resp) => {
  var wid = req.body.wid
  var action = req.body.action
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
    }else{
      User.findOneAndUpdate({uid: Uid},
        {$pull: {collectPics: wid}}, function(err, user){
          if(err) console.log(err)
          else {
            console.log(Uid + " collects this picture");
          }
        });
    } 
      Wallpaper.findOneAndUpdate({_id: wid},
        {$inc: {collects: action}}, function(err, user){
          console.log("wwwwwww"+action)
            if(err) console.log(err)
            else {
              console.log("success")
              resp.send("success")
            }
        });
      
  });   
})

app.get('/wallpapers/collections', (req, res) => {
    User.findOne({uid:Uid}).populate("collectPics").exec(function(err, wallpapers) {
      function A(){
        return new Promise((resolve, reject) => {
         if(err) console.log(err)
         else {
             console.log("all is"+wallpapers.collectPics)
             User.findOne({uid:Uid}).exec(function(err, likes){
               if(err) console.log(err)
               else{
                 for(var i = 0; i < wallpapers.collectPics.length; i++) {
                   let isLiked=likes.likePics.some((item)=>{
                     return item.toString() === wallpapers.collectPics[i]._id.toString();})
                   let isCollected=likes.collectPics.some((item)=>{
                     return item.toString() === wallpapers.collectPics[i]._id.toString();})
                     wallpapers.collectPics[i]["isLiked"]=isLiked
                     wallpapers.collectPics[i]["isCollected"]=isCollected
                   console.log("is collect"+isCollected)
                 }
               } 
                resolve();         
             })        
         }
        }
   
        )}
   
        async function init(){
          await A();
          res.send(wallpapers.collectPics)
        }
        init()
      })       
})

app.get('/wallpapers/upload', (req, res) => {
    User.findOne({uid:Uid}).populate("uploadPics").exec(function(err, wallpapers) {
      function A(){
        return new Promise((resolve, reject) => {
         if(err) console.log(err)
         else {
             console.log("all is"+wallpapers.uploadPics)
             User.findOne({uid:Uid}).exec(function(err, likes){
               if(err) console.log(err)
               else{
                 for(var i = 0; i <wallpapers.uploadPics.length; i++) {
                   let isLiked=likes.likePics.some((item)=>{
                     return item.toString() === wallpapers.uploadPics[i]._id.toString();})
                   let isCollected=likes.collectPics.some((item)=>{
                     return item.toString() === wallpapers.uploadPics[i]._id.toString();})
                     wallpapers.uploadPics[i]["isLiked"]=isLiked
                     wallpapers.uploadPics[i]["isCollected"]=isCollected
                   console.log("is collect"+isCollected)
                 }
               } 
                resolve();         
             })        
         }
        }
   
        )}
   
        async function init(){
          await A();
          res.send(wallpapers.uploadPics)
        }
        init()
      })   
})

// app.get('/search', (req, res) => {
//     let keyword = 'dog'
//     unsplash.search.photos(keyword, 1, 20)  
//         .catch(err => {
//             console.log(err);
//         })
//         .then(toJson)
//         .then(json => {
//             res.send(json)
//         });    
// })

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
    let newUser = {uid : userData.user.uid, username: req.body.username}
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

// app.post('/upload', (req, res) => {
//   let newWallpaper = {_id: new mongoose.Types.ObjectId(), url : req.body.url}
//   Wallpaper.create(newWallpaper, function(err, wallpaper){
//     if(err) console.log(err)
//     else{
//         User.findOneAndUpdate({uid: Uid},
//           {$push: {uploadPics: wallpaper._id.toString()}}, function(err, user){
//             if(err) console.log(err)
//             else {
//               console.log(user)
//               res.send('succussfully upload')
//             }
//           });
//     }
//     })
// })

app.post('/upload', (req, res) => {
    console.log("Upload Request")
    console.log(req)
    console.log(req.body.image)
    let uname = "default";
    User.findOne({uid: Uid}).exec().then((result) => {
      uname = result.username;
      console.log("sdjflsjlkfjklsdfkl: ")
      console.log(uname);
    });

    cloudinary.uploader.upload(req.body.image, (result) => {
      var image_url = result.secure_url
      console.log("aaaaaaaaaa" + image_url)
      let newWallpaper = {_id: new mongoose.Types.ObjectId(), url : image_url, username: uname}
      console.log(newWallpaper)
      Wallpaper.create(newWallpaper, function(err, wallpaper){
      if(err) console.log(err)
      else{
        console.log(wallpaper)
        console.log("enter")
        console.log(wallpaper._id.toString())
        console.log(typeof wallpaper._id.toString())
        console.log("leave")
          User.findOneAndUpdate({uid: Uid},
            {$push: {uploadPics: wallpaper._id.toString()}}, function(err, user){
              if(err) console.log(err)
              else {
                console.log(user)
              }
            });
      } 
      })
    })
})



// module.exports = (filePath,Uid) => {
//     var url
//     // cloudinary config
//     cloudinary.config({ 
//         cloud_name: 'candong', 
//         api_key: 823243289597989, 
//         api_secret: '0F1l-otQXSMbnZrj8OQQRZiEEI0'
//     });
//     cloudinary.uploader.upload(filePath, (result) => {
//       url = result.secure_url
//       let newWallpaper = {_id: new mongoose.Types.ObjectId(), url : url}
//       console.log(newWallpaper)
//       Database.wallpaper.create(newWallpaper, function(err, wallpaper){
//       if(err) console.log(err)
//       else{
//         console.log(wallpaper)
//         console.log("enter")
//         console.log(wallpaper._id.toString())
//         console.log(typeof wallpaper._id.toString())
//         console.log("leave")
//           Database.user.findOneAndUpdate({uid: Uid},
//             {$push: {uploadPics: wallpaper._id.toString()}}, function(err, user){
//               if(err) console.log(err)
//               else {
//                 console.log(user)
//               }
//             });
//       } 
//       })
//     })
// }

app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen("8000", function(){
   console.log("API service started!"); 
});