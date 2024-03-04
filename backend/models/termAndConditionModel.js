
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const termAndConditionSchema = new Schema({

 Heading: {
   type: String,
   required: true,
 },
 Description: {
   type: String,
   required : true
 },
} , { timestamps: true })
const termAndConditionModel = mongoose.model('termAndCondition', termAndConditionSchema)

module.exports = termAndConditionModel