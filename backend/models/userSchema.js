
const mongoose = require('mongoose');

const userSchema = mongoose.Schema( {

    firstName:{
        type: String,
        required: true 
    },
    lastName: {
        type: String,
        require: true
    },
    emailAddress: {
        type: String,
        require: true
    },
    password:{
        type: String,
        required: true 
    },
   gender:{
        type: String,
        required: true 
    },
    sexualPreference: {
        type: String,
        required: true 
    },
    age: {
        type: Number,
        required: true 
    },
    description: {
        type: String,
        required: true 
    },
    file: {
        data: Buffer,
        contentType: String,
    },
    path: {
        type: String,
        required: true 
    },
    matches: {
        type: [
            Object
        ],
    },
    likes: {
        type: [
            Object
        ],
    },
    dislikes: {
        type: [
            Object
        ],
    },
})

module.exports = mongoose.model('User', userSchema);

