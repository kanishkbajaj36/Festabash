
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const contactUsSchema = new Schema({
  
    userName : {
    type : String,
    required : true,
    },

    user_Email : {
    type : String ,
    required : true,
    trim: true,
    lowercase: true,    
  
    },

    user_phone: {
    type : Number ,
    required : true
    },
    message : {
        type : String ,
        required : true
    }
      
      
} , { timestamps: true } )
const contactUs = mongoose.model('contactUs', contactUsSchema)

module.exports = contactUs