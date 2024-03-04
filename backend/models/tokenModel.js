
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
 adminId: {
   type: Schema.Types.ObjectId,
   required: true,
   ref: "admin",
 },
 token: {
   type: String,
   required: true,
 },
 createdAt: {
   type: Date,
   default: Date.now,
   expires: 3600, 
 },
})
const Token = mongoose.model('Token', tokenSchema)

module.exports = Token