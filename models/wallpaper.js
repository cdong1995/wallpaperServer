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
    }
});

module.exports = mongoose.model('wallpaper', wallpaperSchema);