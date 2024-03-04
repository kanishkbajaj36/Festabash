const mongoose = require('mongoose');

const AdminNotificationSchema = new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'      
},  
adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'      
}, 

eventId :
{
type : mongoose.Schema.Types.ObjectId,
ref : 'eventModel'
}  ,

userName : {
    type : String
},

date: {
    type: Date,  
},

message :
{
  type : String
},

},{
  timestamps: true,
});

const AdminNotificationDetail = mongoose.model('AdminNotificationDetail', AdminNotificationSchema);

module.exports = AdminNotificationDetail;