const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventImagesSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "eventModel",
    },
    images: [{
        album_name: {
            type: String,
            required: true,
        },
        image_entries: [{
            
            image_path: {
                type: String,
                required: true,
            },
        }],
    }],
}, { timestamps: true });

const event_Image_Model = mongoose.model('event_Image_Model', eventImagesSchema);

module.exports = event_Image_Model;
