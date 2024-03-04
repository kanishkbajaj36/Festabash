const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "userModel",
    },
    eventModel: {
        type: Schema.Types.ObjectId,
        ref: "eventModel",
    },
    userName: {
        type: String,
    },
    user_profileImage : {
        type: String
    },
    title : {
        type : String
    },
    description : {
        type : String
    },
    date : {
        type : String
    },
    due_on : {
        type : String
    },
    status : {
        type: Number,
        enum: [0,1,2],       // 0 for pending , 1 for Done , 2 for cancelled
        default : 0      // Default pending
    },
    assign_to : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel' 
    },
    todo_attachment : {
        type : String
    }
}, { timestamps: true });

const todoModel = mongoose.model('todoModel', todoSchema);

module.exports = todoModel;
