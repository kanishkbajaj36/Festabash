
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
  },
      userName : {
      type : String
      },
    eventId: {
        type: Schema.Types.ObjectId,
       
        ref: "event",
      },
      rating : {
        type : Number ,
        required : true
      },
      message : {
        type : String ,
        required : true
      },
      feedback_Type : 
      {
        type : String,
        enum : ['suggestion' , 'issue' , 'other'],
        required : true
      },
      
} , { timestamps: true } )
const Feedback = mongoose.model('Feedback', feedbackSchema)

module.exports = Feedback