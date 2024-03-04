
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const privacyAndPolicySchema = new Schema({

 Heading: {
   type: String,
   required: true,
 },
 Description: {
   type: String,
   required : true
 },
} , { timestamps: true })
const privacyAndPolicy = mongoose.model('privacyAndPolicy', privacyAndPolicySchema)

module.exports = privacyAndPolicy