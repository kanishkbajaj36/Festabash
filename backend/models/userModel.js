const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fullName :
    {
        type : String,
        required : true
    },

    phone_no : 
    {
        type : Number,
        required : true
    },
    profileImage :
    {
        type: String,
        default: '',
    },
    user_status: {
        type: Number,
        enum: [0,1],    
        default : 1
      },
    email : {
        type : String
    }
    
}, {timestamps: true})


const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel