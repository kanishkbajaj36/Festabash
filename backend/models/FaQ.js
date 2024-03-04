
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const faqSchema = new Schema({
  
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
        type : String,
        required : true
    }
      
      
} , { timestamps: true } )
const faqModel = mongoose.model('faqModel', faqSchema)

module.exports = faqModel