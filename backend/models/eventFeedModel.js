const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventFeedSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
    },
    userName: {
      type: String,
    },
    user_profileImage: {
      type: String,
      default: '',
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "eventModel",
    },
    feed_description: {
      type: String,
    },
    feed_image: {
      type: String,
      default: '',
    },
    feed_review: {
      likes: [{
        type: Schema.Types.ObjectId,
        ref: "userModel",
      }],
      comments: [{
        userName: {
          type: String,
        },
        user_image: {
            type: String,
            default: '',
          }, 
        text_comment: {
          type: String,
        },
      }],
      views: [{
        type: Schema.Types.ObjectId,
        ref: "userModel",
      }],
     
      like_count: {
        type: Number,
        default: 0,
      },
      comment_count: {
        type: Number,
        default: 0,
      },
      view_count: {
        type: Number,
        default: 0,
      },
    },
  }, { timestamps: true });
  

const eventFeedModel = mongoose.model('eventFeedModel', eventFeedSchema);

module.exports = eventFeedModel;
