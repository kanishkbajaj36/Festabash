const fcmadmin = require('firebase-admin');
const bookmarkModel = require('../models/bookmarkModel');

const path = require('path');

// ...

fcmadmin.initializeApp({
  credential: fcmadmin.credential.cert(path.join(__dirname, '../utils/festa-bash-firebase-adminsdk-pp6dn-031664485c.json')),
});


// Function to send notification using FCM
const sendPushNotification = async (registrationToken, message, eventId, guestId, collectionName) => {
    try {
             
      // Validate registrationToken
      if (!registrationToken || (Array.isArray(registrationToken) && registrationToken.length === 0)) {
        
        throw new Error('Invalid or empty registration token');
      }
  
      const payload = {
        notification: {
          title: 'Event Invitation',
          body: message,
        },
        data: {
          eventId: eventId,
          guestId: guestId,
          collectionName: collectionName,
        },
      };
  
      // Ensure registrationToken is not an empty string
      if (typeof registrationToken === 'string' && registrationToken.trim() === '') {
        console.error('Invalid registration token (empty string)');
        throw new Error('Invalid registration token');
      }
              
  
      // Send push notification
      const response = await fcmadmin.messaging().sendToDevice(registrationToken, payload);

      console.log('Notification sent successfully:', response);
  
      return {
        eventId: eventId,
        guestId: guestId,
        status: 'Pending',
        collectionName: collectionName,
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  };
  
  
  
  
// Function to retrieve FCM registration tokens for guests bookmarked with a collection name
const getRegistrationTokensForBookmarkCollection = async (collectionName) => {
    try {
      const bookmarks = await bookmarkModel.find({ collectionName, status: 1 });
  
      if (bookmarks.length > 0) {
        return bookmarks.map(bookmark => bookmark.phone_no);
      } else {
        throw new Error('No bookmarks found for the given collection name');
      }
    } catch (error) {
      console.error('Error retrieving FCM registration tokens:', error);
      throw error;
    }
  };

module.exports = {
  sendPushNotification,
  getRegistrationTokensForBookmarkCollection,
};
