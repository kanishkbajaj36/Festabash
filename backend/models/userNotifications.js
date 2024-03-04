const mongoose = require('mongoose');

const UsersNotificationSchema = new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'      
},  
eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventModel',     
},  
event_image : 
{
  type : String
},

date: {
    type: Date,  
},

title :
{
  type : String
},

message :
{
  type : String
},

userEmail : {
    type : String
},
userName : {
    type : String
},
phone_no : {
  type : Number
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
    enum : [0 , 1],
    default  : 1
}
},{
  timestamps: true,
});

const UsersNotificationModel = mongoose.model('UsersNotificationModel', UsersNotificationSchema);

module.exports = UsersNotificationModel;