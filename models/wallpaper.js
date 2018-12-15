const mongoose = require('mongoose')
var wallpaperSchema = new mongoose.Schema({
    //_id:String,
    _id: mongoose.Schema.Types.ObjectId,
    url: String,
    likes: {
        type:Number,
        default: 0
    },
    collects: {
        type:Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isCollected: {
        type: Boolean,
        default: false
    },
    username: String
});

module.exports = mongoose.model('wallpaper', wallpaperSchema);