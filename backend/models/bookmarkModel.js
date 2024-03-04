const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new mongoose.Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "eventModel",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
  },
  bookmark_Collection : [{
    name: {
      type: String,
      required: true,
    },
    bookmark_entries: [{
      Guest_Name: {
        type: String,
      },
      phone_no: {
        type: String,
      },
      status: {
        type: Number,
        enum: [0, 1],
        default: 0,
        // 1 for save as favorite
      },
    }],
  }],
}, { timestamps: true });

const bookmarkModel = mongoose.model('bookmarkModel', bookmarkSchema);

module.exports = bookmarkModel;
