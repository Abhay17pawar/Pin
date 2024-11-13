const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    rating : {
        type : String,
        required : true
    },
    lat : {
        type : Number,
        required : true
    },
    long : {
        type : Number,
        required : true
    },
}, {
    timestamps : true
});

module.exports = mongoose.model('Pin' , PinSchema);