const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true, 
        lowercase: true, 
        match: /^\S+@\S+\.\S+$/, 
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: '',
    },
    firstName : {
          type : String ,
          required : true
    },
    lastName : {
        type: String
    } 
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
