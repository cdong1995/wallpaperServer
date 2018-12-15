const mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({
    uid: String,
    username:String,
    likePics: [{        
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'wallpaper'      
    }],
    collectPics: [{       
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'wallpaper'
    }],
    uploadPics: [{         
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'wallpaper'
    }]
});

module.exports = mongoose.model('user', UserSchema);