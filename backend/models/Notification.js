const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'      
},
message :
{
  type : String
},
phone_no : {
    type : Number
  },  

eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventModel',     
},  
event_image : 
{
  type : String
},
event_location : {
  type : String
},
status : {
  type : Number,
  enum : [0 ,1],
 
},

title :
{
  type : String
},

description : {
    type : String
},

userEmail : {
    type : String
},
userName : {
    type : String
},

},{
  timestamps: true,
});

const NotificationModel = mongoose.model('NotificationModel', NotificationSchema);

module.exports = NotificationModel;