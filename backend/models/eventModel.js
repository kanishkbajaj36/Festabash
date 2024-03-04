const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
  },
  userName: {
    type: String
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
  },
  adminName: {
    type: String
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  event_Type: {
    type: String,
    enum: ['Business Conference', 'Music Festivals', 'Birthday', 'Exhibitions', 'Wedding Anniversary', 'Sports', 'marriage', 'Demo', 'Marriage'],
  },
  city_Name : {
    type : String
  },
  co_hosts: [
    {
      co_host_Name: {
        type: String
      },
      phone_no: {
        type: String
      },
      // permissions: {
      //   newVenue_Date_Time: { type: Boolean, default: true },
      //   edit_Venue_Date_Time: { type: Boolean, default: true },
      //   delete_Venue_Date_Time: { type: Boolean, default: true },
      //   add_guest: { type: Boolean, default: true },
      //   import_Guest: { type: Boolean, default: true },
      //   getAllGuest: { type: Boolean, default: true },
      //   addAllGuestsToBookmark: { type: Boolean, default: true },
      //   deleteGuestInCollection: { type: Boolean, default: true },    
      //   deleteEvent: { type: Boolean, default: false },
      //   sendInvitation: { type: Boolean, default: true },
      //   updateEvent: { type: Boolean, default: true },
      //   getAllInvited_Event: { type: Boolean, default: true },
      //   getVenuesOf_Event: { type: Boolean, default: true },
      //   userRespondToInvitedEvent: { type: Boolean, default: true },
      //   getAll_co_Hosts: { type: Boolean, default: true },
      //   getAllGuest_with_Response: { type: Boolean, default: true },
      //   delete_Guest: { type: Boolean, default: true },
      //   getallResponseEvent: { type: Boolean, default: true },
      //   getSubEventOf_Event: { type: Boolean, default: true },
      //   createEventAlbum: { type: Boolean, default: true },
      //   getAllAlbum: { type: Boolean, default: true },
      //   getParticularAlbum: { type: Boolean, default: true },
      //   addImages_in_Album: { type: Boolean, default: true },
      //   rename_album: { type: Boolean, default: true },
      //   deleteAlbum: { type: Boolean, default: true },
      //   deleteImage: { type: Boolean, default: true },
      //   get_Event_on_date: { type: Boolean, default: true },
      //   get_all_comments: { type: Boolean, default: true },
      //   getCollectionGuests: { type: Boolean, default: true },
      //   getFeedbacksofEvent: { type: Boolean, default: true },
      //   checkAndToggleStatus: { type: Boolean, default: true },
      //   deleteFeedback_OfEvent: { type: Boolean, default: true },
      //   getAllFeedback: { type: Boolean, default: true },
      //   deleteFeedback: { type: Boolean, default: true },
      //   getAllCollections: { type: Boolean, default: true },
      //   getCollectionById: { type: Boolean, default: true }
      //   // Add more permissions as needed
      // }
    },
  ],
  Guests: [
    {
      Guest_Name: {
        type: String
      },
      phone_no: {
        type: String
      },
      status: {
        type: Number,
        enum: [0, 1],
        default: 0
      }
    },
  ],
  images: {
    type: [String],
  },
  event_key: {
    type: Number
  },
  event_status: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  event_key : {
    type : Number,
    default : 1
  },

  
  venue_Date_and_time: [
    {
      sub_event_title: {
        type: String,
        default : ''
      },
      venue_Name: {
        type: String,
      },
      venue_location: {
        type: String,
      },
      date: {
        type: String,
      },
      start_time: {
        type: String,
      },
      end_time: {
        type: String,
      },
    }
  ],
}, { timestamps: true });

const eventModel = mongoose.model('eventModel', eventSchema);

module.exports = eventModel;
