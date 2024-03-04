const userModel = require('../models/userModel')
const eventModel = require('../models/eventModel')
const bookmarkModel = require('../models/bookmarkModel')
const feedbackModel = require('../models/feedbackModel')
const AdminNotificationDetail = require('../models/AdminNotification')
const cors = require('cors')
const upload = require('../utils/uploads')
const fs = require('fs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const path = require('path')
const ExcelJs = require('exceljs')
const eventImageModel = require('../models/eventImages')
const contactUs = require('../models/contactUs')
const InvitedeventModel = require('../models/Invitation')
const eventFeedModel = require('../models/eventFeedModel')
const NotificationModel = require('../models/Notification')
const UsersNotificationModel = require('../models/userNotifications')

const { ObjectId } = require('mongoose').Types;

const todoModel = require('../models/todomodel')
const Admin = require('../models/AdminModel')
const faqModel = require('../models/FaQ')

const fast2sms = require('fast-two-sms')
const twilio = require('twilio');
const phoneUtil = require('libphonenumber-js');
const userResponseEventModel = require('../models/userResponseEvent')
const accountSid = 'AC126e34876c0bcb57eca92293dedfbc93';
const authToken = '45a257477425131532341d7c50154269';
const twilioPhone  = '+17078202575'; 
const twilioClient = new twilio(accountSid, authToken);
const axios = require('axios');
const { TrustProductsEntityAssignmentsPage } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments')
                                /* API for users */
    // API for user signup
     
    const userSignUp = async (req, res) => {
      try {
          const { fullName, phone_no, email } = req.body;
  
          // Validation
          const requiredFields = ['fullName', 'phone_no'];
          for (const field of requiredFields) {
              if (!req.body[field]) {
                  return res.status(400).json({
                      success: false,
                      message: `Missing ${field.replace('_', ' ')} field`,
                  });
              }
          }
  
          // Check if phone number already exists
          const existPhoneNumber = await userModel.findOne({ phone_no });
          if (existPhoneNumber) {
              return res.status(400).json({
                  success: false,
                  message: 'User with the same number already exists',
              });
          }
  
          // Save user
          const imagePath = req.file ? req.file.filename : null; // Check if a file is uploaded
          const newUser = new userModel({
              fullName,
              phone_no,
              profileImage: imagePath,
              user_status: userModel.schema.path('user_status').getDefault(),
              email: email || null, 
          });
  
          const saveUser = await newUser.save();
  
          // Response
          res.status(200).json({
              success: true,
              message: 'User created successfully',
              user_details: {
                  fullName: saveUser.fullName,
                  phone_no: saveUser.phone_no,
                  profileImage: saveUser.profileImage,
                  userId: saveUser._id,
                  user_status: saveUser.user_status,
                  email: saveUser.email,
              },
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({
              success: false,
              message: 'server error',
              error_message : error.message
          });
      }
  };  
      // update user
      const updateUser = async (req, res) => {
        try {
          const id = req.params.id;
          const { fullName, phone_no, email } = req.body;
          const user = await userModel.findOne({ _id: id });
      
          // Check for user existence
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
      
          user.fullName = fullName;
      
          // Validate and update Phone number
          if (phone_no) {
            user.phone_no = phone_no;
          }
      
          // Create or update email field
          user.email = email || null;
      
          // Check if a file is uploaded
          if (req.file) {
            const profile = req.file.filename;
      
            // Check if user already has a profile image
            if (user.profileImage) {
              // User has a profile image, update it
              user.profileImage = profile;
              await user.save();
      
              // Update user profile image in eventFeedModel
              await eventFeedModel.updateMany({ userId: id }, { $set: { user_profileImage: profile } });
      
              return res.status(200).json({
                success: true,
                message: 'Profile image and information updated successfully',
              });
            } else {
              // User does not have a profile image, create it
              user.profileImage = profile;
              await user.save();
      
              // Update user profile image in eventFeedModel
              const feed_user = await eventFeedModel.findOne({ userId: id });
              if (!feed_user) {
                return res.status(400).json({
                  success: false,
                  message: 'User not found in eventFeedModel',
                });
              }
              feed_user.user_profileImage = profile;
              await feed_user.save();
      
              return res.status(200).json({
                success: true,
                message: 'New profile image created and information updated successfully',
              });
            }
          } else {
            // No profile image provided, only update user information
            await user.save();
      
            return res.status(200).json({
              success: true,
              message: 'User information updated successfully',
            });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, message: 'server Error', error_message : error.message });
        }
      };     
      
  // Api for get particular user details by there id
               const getUser = async( req ,res)=>{
                try {
                       const userId = req.params.userId
                      // check for userId
                  if(!userId)
                  {
                    return res.status(400).json({
                                   success : false ,
                                   userIdRequired : 'user id Required',

                    })
                  }

                  // check for user
                const user = await userModel.findOne({ _id : userId })
                if(!user)
                {
                  return res.status({
                                 success : false ,
                                 userExistanceMessage : 'user not found'
                  })
                }
                else
                {
                  return res.status(200).json({
                                  success : true ,
                                  message : 'user Details' ,
                                  user_details : user
                  })
                }
                } catch (error) {
                  return res.status(500).json({
                               success : false ,
                               Error_Message : 'server Error'
                  })
                }
               }
      // APi for check number existance
      const numberExistance = async (req, res) => {
        try {
          const phone_no = req.body.phone_no;
          // check for phone_no existence
          const phone_exist = await userModel.findOne({ phone_no });
      
          if (!phone_exist) {
            return res.status(400).json({
              success: false,
              phone_no_required: 'Phone number does not exist in the user table',
            });
          } else {
            return res.status(200).json({
              success: true,             
              successMessage: 'phone number exists in the user table',
            });
          }
        } catch (error) {
          return res.status(500).json({
            success: false,
            serverError: 'Server error',
          });
        }
      };      

    // user login
                    const userLogin = async(req,res)=>{                      
                        try {
                        const { phone_no } = req.body;
                    
                        // Find Admin by email
                        const user = await userModel.findOne({ phone_no });
                    
                        if (user) {
                            
                            return res.json({ message: 'user Login Successful', 
                                                 success: true,
                                                  data: {
                                                        _id : user._id,
                                                        fullName : user.fullName,
                                                        phone_no : user.phone_no ,
                                                        profileImage : user.profileImage
                                                  } });
                        } else {
                            return res.status(400).json({ message: 'phone_no not found', success: false });
                        }
                        } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Internal server error', success: false });
                        }
                    };

  
                   
                                                      /*  Event management */


    // API for create Event
    const create_Event = async (req, res) => {
      try {
        const userId = req.params.userId;
        const {
          title,
          description,
          event_Type,
          venue_Date_and_time,
          city_Name
        } = req.body;
    
        const requiredFields = ['title', 'description', 'event_Type'];
        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res.status(400).json({ message: `Missing ${field.replace('_', ' ')} field`, success: false });
          }
        }
    
        // check for user 
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
          return res.status(400).json({ success: false, message: `User not found` });
        }
        const userName = user.fullName;
    
        const event = await eventModel.findOne({
          userId,
          title
      });
      
      if (event) {
          return res.status(400).json({
              success: false,
              eventExistanceMessage: 'Event already exists with the same userId and title'
          });
      }

        // Initialize venue_details as an empty array
        let venue_details = [];
    
        // If venue_Date_and_time is provided, process and set the details
        if (venue_Date_and_time) {
          if (venue_Date_and_time !== '') {
            venue_details = JSON.parse(venue_Date_and_time);
          }
        }
    
        // Process and store multiple image files
        const imagePaths = [];
        if (req.files && req.files.length > 0) {
          req.files.forEach(file => {
            imagePaths.push(file.filename);
          });
        }
    
        const newEvent = new eventModel({
          title,
          description,
          event_Type,
          venue_Date_and_time: venue_details,
          Guests: [], 
          co_hosts: [], 
          images: imagePaths,
          userId: userId,
          userName: userName,
           event_key : 1,
           city_Name : city_Name,
          event_status: eventModel.schema.path('event_status').getDefault(),
        });
    
        const saveEvent = await newEvent.save();
        const newAdminNotification = new AdminNotificationDetail({
          userId,
          userName: userName,
          message: `Congratulations..!! New event: ${saveEvent.title} has been created by the user: ${userName}`,
          date: new Date(),
        });
    
        await newAdminNotification.save();
        res.status(200).json({
          success: true,
          message: 'New Event created successfully',
          eventId: saveEvent._id
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: 'There is a server error'
        });
      }
    };
   
    
// API for add multiple event 
           
           const newVenue_Date_Time = async (req ,res) =>{
            const eventId = req.params.eventId
            const {sub_event_title ,venue_Name , venue_location, date , start_time , end_time} = req.body     
            try {
                        

                const event = await eventModel.findOne({ _id:eventId })
      
                if(!event)
                {
                    return res.status(400).json({ success : false , message : `event not found with the eventId ${eventId}`})
                }

                  //  newVenue_Date_Time is an array in the event model
              const duplicateVenue_Date_Time = event.venue_Date_and_time.find((venue) => venue.sub_event_title === sub_event_title);

              // if (duplicateVenue_Date_Time) {
              //   return res.status(400).json({ success: false, message: `venue '${venue_Name}' already exists in a event` });
              // }
                
              event.venue_Date_and_time.push({
                sub_event_title,
                venue_Name, 
                venue_location,                               
                date:date,
                start_time,
                end_time

            })
            await event.save()
            return res.status(200).json({ 
                                  success : true , 
                                message : `sub event added successfully`})
            } catch (error) {
                return res.status(500).json({
                    success : false ,
                    message : ' there is an server error'
                })
            }
           }

// add co host
const add_co_host = async (req, res) => {
  const eventId = req.params.eventId;
  const { co_host_Name, phone_no } = req.body;
  try {
      const event = await eventModel.findOne({ _id: eventId });
      if (!event) {
          return res.status(404).json({
              success: false,
              message: 'Event not found with the given eventId'
          });
      }

      // Check if the phone number already exists among co-hosts
      const existPhoneNumber = event.co_hosts.find((cohost) => cohost.phone_no === phone_no);
      if (existPhoneNumber) {
          return res.status(400).json({
              success: false,
              message: `Co-host with the phone number ${phone_no} already exists`
          });
      }

      // Generate a new ObjectId for couserId
      const couserId = new ObjectId();

      // Add co-host to the event
      const newCoHost = {
          _id: couserId,
          co_host_Name,
          phone_no
      };

      event.co_hosts.push(newCoHost);

      // Save the event
      await event.save();

      // Check for invited event and add co-host if it exists
      let invitedEvent = await InvitedeventModel.findOne({ eventId: eventId });
      if (invitedEvent) {
          invitedEvent.co_hosts.push(newCoHost);
          await invitedEvent.save();
      }

      return res.status(200).json({
          success: true,
          message: `Co-host added successfully`
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

// API for delete co-host in event
                             const delete_co_Host = async (req , res)=>{
                              
                                try {
                                  const eventId = req.params.eventId
                                  const co_userId = req.params.co_userId

                                  // check for event 
                                  const event = await eventModel.findOne({ _id : eventId })
                                  if(!event)
                                  {
                                    return res.status(400).json({
                                                     success : false ,
                                                      message : `event  not found`
                                    })
                                  }                                   
                                                                      
                                        // check for co-host existance
                                    const exist_co_hostIndex = event.co_hosts.findIndex(co_host => co_host._id.toString() === co_userId)
                                    if(exist_co_hostIndex === -1)
                                    {
                                      return res.status(400).json({ 
                                                                success : false ,
                                                                message : `co_host not found`
                                      })
                                    }


                                  // remove the co-host from the co_host array
                                  event.co_hosts.splice(exist_co_hostIndex , 1)

                                  await eventModel.findByIdAndUpdate(
                                    { _id : eventId },
                                    { co_hosts : event.co_hosts}
                                  )

                                  res.status(200).json({
                                    success : true,
                                    message : `co-host deleted successfully`
                                    })

                                } catch (error) {
                                  return res.status(500).json({
                                                            success : false ,
                                                            message : 'there is an server error'
                                  })
                                }
                              }
      
            // APi for get co-host  of event
                             
            const getAll_co_Hosts = async (req, res) => {
              try {
                const eventId = req.params.eventId;
            
                // Check for event existence
                const event = await eventModel.findOne({ _id: eventId });
            
                if (!event) {
                  return res.status(404).json({
                    success: false,
                    message: 'Event not found',
                  });
                }
            
                const co_Hosts = event.co_hosts;
            
                res.status(200).json({
                  success: true,
                  message: 'All coHosts in the event',
                  co_hostsData: co_Hosts,
                });
              } catch (error) {
                
                res.status(500).json({
                  success: false,
                  message: 'There is a server error',
                });
              }
            };

 
// API for edit Venue_Date_Time 
                    const edit_Venue_Date_Time = async (req ,res)=>{
                      let eventId;
                      try {
                          const venueId = req.params.venueId;
                          eventId = req.params.eventId;
                          // check for subEventId
                          if(!venueId)
                          {
                            return res.status(400).json({
                                             success : false ,
                                             subEventIdRequired : 'Sub event ID required'
                            })
                          }
                        // check for eventId 
                        if(!eventId)
                        {
                          return res.status(400).json({
                                           success : false ,
                                           eventIdRequired : 'event Id required'
                          })
                        }
                          const {sub_event_title , venue_Name , venue_location, date , start_time , end_time} = req.body
                          // Check for event existence
                          const existEvent = await eventModel.findOne({ _id: eventId });
                          if (!existEvent) {
                              return res.status(404).json({ success: false, message: "event not found" });
                          }
                              // Check if the venue_Date_and_time array exists within event

                                if(!existEvent.venue_Date_and_time || !Array.isArray(existEvent.venue_Date_and_time))
                                {
                                  return res.status(400).json({ success : false ,
                                                                message : "venue date and time array not found in the route"})
                                }

                              // Check for venueIndex
                          const existVenueIndex = existEvent.venue_Date_and_time.findIndex(
                              (venue) => venue._id.toString() === venueId
                          );
                          if (existVenueIndex === -1) {
                              return res.status(404).json({ success: false, message: "sub Event not found" });
                          }
                            
                              // Update the properties of the venue
                            existEvent.venue_Date_and_time[existVenueIndex].sub_event_title = sub_event_title
                            existEvent.venue_Date_and_time[existVenueIndex].venue_Name = venue_Name
                            existEvent.venue_Date_and_time[existVenueIndex].venue_location = venue_location
                            existEvent.venue_Date_and_time[existVenueIndex].date = date
                            existEvent.venue_Date_and_time[existVenueIndex].start_time = start_time
                            existEvent.venue_Date_and_time[existVenueIndex].end_time = end_time
                            
                              // Save the updated event back to the database
                              await existEvent.save()
                              return res.status(200).json({
                                                          success : true ,
                                                          message : `SubEvent edited successfully `
                              })                          
                                  } catch (error) {
                                    
                                      return res.status(500).json({
                                          success : false ,
                                          message : ' server error'
                                      })
                                  }
                                }

// API for delete venue in a Event
                              const delete_Venue_Date_Time = async (req ,res)=>{
                                  
                                  try {
                                        const venueId = req.params.venueId
                                        const eventId = req.params.eventId
                                            // check for event existance
                                        const event = await eventModel.findById(eventId)
                                        if(!event)
                                        {
                                          res.status(400).json({
                                                        success : false,
                                                        message : 'event not found'
                                          })
                                        }                                                    
                                     
                                        // check for venue existance
                                    const existVenueIndex = event.venue_Date_and_time.findIndex(venue => venue._id.toString() === venueId)
                                    if(existVenueIndex === -1)
                                    {
                                      return res.status(400).json({
                                                             success : false ,
                                                             message : "SubEvent not found "
                                      })
                                    }
                                  // remove the venue from the venue_Date_and_Time array
                                  event.venue_Date_and_time.splice(existVenueIndex, 1)

                                    await eventModel.findByIdAndUpdate(
                                          { _id:eventId },
                                          {venue_Date_and_time : event.venue_Date_and_time}
                                    )

                                    res.status(200).json({
                                                      success : true,
                                                      message : `SubEvent deleted successfully`
                                    })


                                  } catch (error) {
                                      return res.status(500).json({
                                          success : false,
                                          message : 'there is a server error'
                                      })
                                  }
                              }

// add guest in event
                      const add_guest = async (req, res) => {
                        try {
                          const eventId = req.params.eventId;
                          const { Guest_Name, phone_no, eventGuest_key } = req.body;

                          const requiredFields = ['Guest_Name', 'phone_no', 'eventGuest_key'];

                          for (const field of requiredFields) {
                            if (!req.body[field]) {
                              return res.status(400).json({ message: `Missing ${field.replace('_', ' ')} field`, success: false });
                            }
                          }

                          // Check for event
                          const event = await eventModel.findOne({ _id: eventId });

                          if (!event) {
                            return res.status(400).json({ success: false, message: `Event not found with the eventId ${eventId}` });
                          }

                          // Convert eventGuest_key to integer if it's a string
                          const key = parseInt(eventGuest_key);

                          if (![1, 2].includes(key)) {
                            return res.status(400).json({ success: false, message: `Invalid eventGuest_key value` });
                          }

                          if (key === 1) {
                            // Check if guest already exists with the same phone number 
                            const guestExist = event.Guests.find((guest) => guest.phone_no === phone_no);

                            if (guestExist) {
                              return res.status(400).json({
                                success: false,
                                guestExistMessage: 'Guest already exists with the same phone_no',
                              });
                            }

                            // Add the new guest to the Guests array
                            event.Guests.push({
                              Guest_Name,
                              phone_no,
                              status: 0,
                            });

                            await event.save();

                            return res.status(200).json({
                              success: true,
                              message: `Guest added successfully`,
                            });
                          } else if (key === 2) {
                            // Check for invited Event
                            const invitedEvent = await InvitedeventModel.findOne({ _id : eventId });

                            if (!invitedEvent) {
                              return res.status(400).json({ success: false, message: `Invited event not found with the eventId ${eventId}` });
                            }

                            // Check if guest already exists with the same phone number in the invited event
                            const guestExistInInvitedEvent = invitedEvent.Guests.find((guest) => guest.phone_no === phone_no);

                            if (guestExistInInvitedEvent) {
                              return res.status(400).json({
                                success: false,
                                guestExistMessage: 'Guest already exists with the same phone_no in the invited event',
                              });
                            }
                            else{
                              // Add the guest to the Invited Event 
                            invitedEvent.Guests.push({
                              Guest_Name,
                              phone_no,
                              status: 2
                            });
                            await invitedEvent.save();

                            // Check if user exists with the provided phone number
                            const user = await userModel.findOne({ phone_no: phone_no });

                            if (user) {
                              // Create a notification for the user
                              await NotificationModel.create({
                                eventId: event._id,
                                title: event.title,
                                description: event.description,
                                userId: user._id,
                                phone_no: phone_no,
                                message: `Hello, you are invited to ${event.title} by ${event.userName}`
                              });
                            } else {
                              // Sending SMS to invalid guests
                              const formattedPhoneNumber = `+91${phone_no}`;
                              const message = `Hello, you are invited to ${event.title} by ${event.userName}. Receive updates about the event on the link: https://localhost.com`;

                              // Use SMS Gateway Hub to send SMS
                              await sendSMSUsingGatewayHub(formattedPhoneNumber, message);
                            }

                            return res.status(200).json({
                              success: true,
                              message: 'Guests added successfully',
                            });
                          }
                            }

                            
                        } catch (error) {
                          console.error(error);
                          return res.status(500).json({
                            success: false,
                            message: 'There is a server error',
                          });
                        }
                      };



      // API for import guest from excel
                          const import_Guest = async (req, res) => {
                            try {
                              const eventId = req.params.eventId;
                          
                              // Check for event existence
                              const event = await eventModel.findOne({ _id: eventId });
                          
                              if (!event) {
                                return res.status(400).json({
                                  success: false,
                                  message: 'Event not found',
                                });
                              }
                          
                              const workbook = new ExcelJs.Workbook();
                              await workbook.xlsx.readFile(req.file.path);
                              const worksheet = workbook.getWorksheet(1);
                              const guestData = {};
                          
                              worksheet.eachRow((row, rowNumber) => {
                                if (rowNumber !== 1) {
                                  // Skip the header row
                                  const phone_no = row.getCell(2).value;
                                  const rowData = {
                                    Guest_Name: row.getCell(1).value,
                                    phone_no: phone_no,
                                  };
                                  // Check if the phone_no already exists in the event's Guests array
                                  if (!event.Guests.some((guest) => guest.phone_no === phone_no)) {
                                    guestData[phone_no] = rowData;
                                  }
                                }
                              });
                          
                              const uniqueGuestData = Object.values(guestData);
                          
                              if (uniqueGuestData.length > 0) {
                                // Use the $addToSet operator to add only unique phone numbers to the event
                                await eventModel.updateOne(
                                  { _id: eventId },
                                  { $addToSet: { 'Guests': { $each: uniqueGuestData } } }
                                );
                          
                                res.status(200).json({
                                  success: true,
                                  message: 'Guest data imported successfully',
                                });
                              } else {
                                res.status(200).json({
                                  success: true,
                                  message: 'No new guest data to import',
                                });
                              }
                            } catch (error) {
                              console.error(error);
                              return res.status(500).json({
                                success: false,
                                message: 'There is a server error',
                              });
                            }
                          };
      
      
        // APi for get all Guests in event
                    const getAllGuest = async (req, res) => {
                      try {
                        const eventId = req.params.eventId;
                    
                        // Check for event existence
                        const event = await eventModel.findOne({ _id: eventId });
                    
                        if (!event) {
                          return res.status(200).json({
                            success: false,
                            message: 'Event not found',
                          });
                        }
                    
                        const guest = event.Guests;
                    
                        res.status(200).json({
                          success: true,
                          message: 'All guests in the event',
                          guest_data: guest,
                        });
                      } catch (error) {
                        
                        res.status(500).json({
                          success: false,
                          message: 'There is a server error',
                        });
                      }
                    };

                                                              
   // Api for delete Guests in event
                      const delete_Guest = async (req , res)=>{
                                                  
                        try {
                          const eventId = req.params.eventId
                          const guestId = req.params.guestId

                          // check for event 
                          const event = await eventModel.findOne({ _id : eventId })
                          if(!event)
                          {
                            return res.status(400).json({
                                            success : false ,
                                              message : `event : ${eventId} not found`
                            })
                          }                                   
                                                              
                                // check for Guest existance
                            const exist_guestIndex = event.Guests.findIndex(guest => guest._id.toString() === guestId)
                            if(exist_guestIndex === -1)
                            {
                              return res.status(400).json({ 
                                                        success : false ,
                                                        message : `guest not found`
                              })
                            }


                          // remove the guest from the Guests array
                          event.Guests.splice(exist_guestIndex , 1)

                          await eventModel.findByIdAndUpdate(
                            { _id : eventId },
                            { Guests : event.Guests}
                          )

                          res.status(200).json({
                            success : true,
                            message : `Guest deleted successfully`
                            })

                        } catch (error) {
                          return res.status(500).json({
                                                    success : false ,
                                                    message : 'there is an server error'
                          })
                        }
                      }        
                                     
  // API to add all guest as favourite in bookmark 
  const addAllGuestsToBookmark = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const collectionName = req.body.collectionName;

        // Validate collectionName as a required field
        if (!collectionName) {
            return res.status(400).json({
                success: false,
                message: 'collectionName is a required field',
            });
        }

        // Check event existence
        const event = await eventModel.findOne({ _id: eventId });
        if (!event) {
            return res.status(400).json({
                success: false,
                message: 'No event found',
            });
        }

        const userId = event.userId; // Move userId declaration and assignment here

        // Check if collectionName already exists in bookmark table
        const existingCollection = await bookmarkModel.findOne({
            eventId: eventId,
            'bookmark_Collection.name': collectionName,
        });

        let updatedCollection;

        if (!existingCollection) {
            // If collectionName does not exist in bookmark table, create a new collection
            const newCollection = new bookmarkModel({
                eventId: eventId,
                userId: userId,
                bookmark_Collection: [{ name: collectionName, bookmark_entries: [] }],
            });

            // Get all unique guests in the event
            const uniqueGuests = Array.from(
                new Set(event.Guests.map((guest) => guest._id.toString()))
            ).map((guestId) =>
                event.Guests.find((guest) => guest._id.toString() === guestId)
            );

            // Set the entries array directly with uniqueGuests values
            newCollection.bookmark_Collection[0].bookmark_entries = uniqueGuests.map((guest) => ({
                Guest_Name: guest.Guest_Name,
                phone_no: guest.phone_no,
                status: 1,
            }));

            // Save the new collection entry
            updatedCollection = await newCollection.save();
        } else {
            // Get all unique guests in the event
            const uniqueGuests = Array.from(
                new Set(event.Guests.map((guest) => guest._id.toString()))
            ).map((guestId) =>
                event.Guests.find((guest) => guest._id.toString() === guestId)
            );

            // Update the bookmark with unique bookmark_entries using $addToSet
            await bookmarkModel.updateOne({
                'eventId': eventId,
                'userId': userId,
                'bookmark_Collection.name': collectionName
            }, {
                $addToSet: {
                    'bookmark_Collection.$.bookmark_entries': {
                        $each: uniqueGuests.map((guest) => ({
                            Guest_Name: guest.Guest_Name,
                            phone_no: guest.phone_no,
                            status: 1,
                        })),
                    },
                },
            });

            // Fetch the updated collection
            updatedCollection = await bookmarkModel.findOne({
                'eventId': eventId,
                'bookmark_Collection.name': collectionName,
            });
        }

        res.status(200).json({
            success: true,
            message: 'All guests added to bookmark as favorites',
            eventId: eventId,
            userId: userId,
            collection_details: updatedCollection.bookmark_Collection.find(
                (collection) => collection.name === collectionName
            ),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'There is a server error',
            error_message: error.message
        });
    }
};

                  
                  
          // delete a particular guest in a collection in bookMark model
          const deleteGuestInCollection = async (req, res) => {
            try {
             
              const collection_id = req.params.collection_id;
              const guestId = req.params.guestId;
              // Check for the presence of collection_id
              if (!collection_id) {
                return res.status(400).json({
                  success: false,
                  message: 'Please provide a collection_id',
                });
              }
          
              // Find the collection with the specified name
              const collection = await bookmarkModel.findOne({
                _id : collection_id
              });
          
              // Check if the collection exists
              if (!collection) {
                return res.status(400).json({
                  success: false,
                  message: `Collection not found`,
                });
              }
          
              // Find the index of the guest in the bookmark_entries array
              const guestIndex = collection.bookmark_Collection[0].bookmark_entries.findIndex(
                (entry) => entry._id.toString() === guestId
              );
          
              // Check if the guest exists in the collection
              if (guestIndex === -1) {
                return res.status(400).json({
                  success: false,
                  message: `Guest not found in collection`,
                });
              }
          
              // Remove the guest from the bookmark_entries array
              collection.bookmark_Collection[0].bookmark_entries.splice(guestIndex, 1);
          
              // Save the updated collection
              await collection.save();
          
              res.status(200).json({
                success: true,
                message: `Guest deleted successfully from collection`,
              });
            } catch (error) {
              console.error(error);
              return res.status(500).json({
                success: false,
                message: 'There is a server error',
              });
            }
          };
          
      // get an particular event
                                 const searchEvent = async (req , res)=>{
                                  try {
                                       const event_Type = req.body.event_Type                                     

                                       // check for event existnace
                                       const event = await eventModel.find({ event_Type : event_Type })
                                       if(!event)
                                       {
                                        return res.status(400).json({
                                                                  success : false ,
                                                                  message : `Event not found `
                                        })
                                       }
                                       else
                                       {
                                        return res.status(200).json({
                                                                   success : true,
                                                                   message : `Event Details`,
                                                                   event_details : event
                                        })
                                       } 
                                       
                                      
                                  } catch (error) {
                                    return res.status(500).json({
                                                       success : false,
                                                       message : ' there is an server error '
                                    })
                                  }
                                 }
                
            
                // API for delete an event
                const deleteEvent = async (req, res) => {
                  try {
                      const eventId = req.params.eventId;
              
                      // Find event, invitedEvent, and userResponseEvent
                      const event = await eventModel.findOne({ _id: eventId });
                      const invitedEvent = await InvitedeventModel.findOne({ _id: eventId });
                      const userResponseEvent = await userResponseEventModel.findOne({ eventId: eventId });
              
                      // Check if any of the documents exist
                      if (!event && !invitedEvent && !userResponseEvent) {
                          return res.status(404).json({
                              success: false,
                              message: `Event not found with the given eventId`
                          });
                      }
              
                      // Delete event, invitedEvent, and userResponseEvent if they exist
                      const deletePromises = [];
                      if (event) {
                          deletePromises.push(event.deleteOne());
                      }
                      if (invitedEvent) {
                          deletePromises.push(invitedEvent.deleteOne());
                      }
                      if (userResponseEvent) {
                          deletePromises.push(userResponseEvent.deleteOne());
                      }
              
                      // Execute all delete operations
                      await Promise.all(deletePromises);
              
                      return res.status(200).json({
                          success: true,
                          message: `Events deleted successfully`
                      });
                  } catch (error) {
                      return res.status(500).json({
                          success: false,
                          message: 'There is a server error',
                          error_message: error.message
                      });
                  }
              };
                                     
            // APi for give feedback
            const feedback = async (req, res) => {
              try {
                  const { userId } = req.params;
                  const { rating, message, feedback_Type } = req.body;
          
                  const requiredFields = ['rating', 'message', 'feedback_Type'];
                  for (const field of requiredFields) {
                      if (!req.body[field]) {
                          return res.status(400).json({ message: `Missing ${field.replace('_', ' ')} field`, success: false });
                      }
                  }
          
                  // Check if user exists
                  const user = await userModel.findOne({ _id: userId });
                  if (!user) {
                      return res.status(400).json({
                          success: false,
                          userExistanceMessage: 'no user found'
                      });
                  }
          
                  const userName = user.fullName;
          
                  // Check if rating is within the range of 1 to 5
                  if (rating < 1 || rating > 5) {
                      return res.status(400).json({
                          success: false,
                          message: 'Rating should be in the range of 1 to 5'
                      });
                  }
          
                  // Check if feedback already exists for the user
                  let existingFeedback = await feedbackModel.findOne({ userId });
          
                  if (existingFeedback) {
                      // Update existing feedback
                      existingFeedback.rating = rating;
                      existingFeedback.message = message;
                      existingFeedback.feedback_Type = feedback_Type;
          
                      await existingFeedback.save();
          
                      return res.status(200).json({
                          success: true,
                          message: 'Feedback updated successfully',
                          feedback_details: existingFeedback
                      });
                  } else {
                      // Create new feedback
                      const feedbacks = new feedbackModel({
                          rating,
                          message,
                          feedback_Type,
                          userId,
                          userName
                      });
          
                      await feedbacks.save();
          
                      return res.status(200).json({
                          success: true,
                          message: 'Feedback saved successfully',
                          feedback_details: feedbacks
                      });
                  }
              } catch (error) {
                  console.error(error);
                  return res.status(500).json({
                      success: false,
                      message: 'There is a server error'
                  });
              }
          };
          

          // APi for delete user
                                     const deleteUser = async (req ,res)=>{
                                      try {
                                        const userId = req.params.userId
                                                  // check for user and delete 
                                        const user = await userModel.findOneAndDelete({ _id : userId })
                                        if(!user)
                                        {
                                          return res.status(400).json({ 
                                                                      success : false ,
                                                                      message : 'User not found'
                                          })
                                        }
                                        else
                                        {
                                          return res.status(200).json({
                                                                    success : true ,
                                                                    message : 'User deleted successfully'
                                          })
                                        }
                                            
                                      } catch (error) {
                                        return res.status(500).json({
                                                                success : false ,
                                                                message : 'there is an server error'
                                        })
                                      }
                                     }
        // APi for get Event Images
                              const getImages = async (req ,res)=>{
                                try {
                                      const eventId = req.params.eventId
                                      // check for event
                                  const event = await eventModel.findOne({ _id : eventId })
                                  if(!event)
                                  {
                                    return res.status(400).json({
                                                            success : false ,
                                                            message : 'event not found'
                                    })
                                  }
                                  
                                  const eventImages = event.images                                 
                                    return res.status(200).json({
                                                          success : true ,
                                                          message : 'event images ',
                                                          eventImages : eventImages
                                    })

                                } catch (error) {
                                  return res.status(500).json({
                                                          success : false ,
                                                          message : 'server error'
                                  })
                                }
                              }
         
 // APi for get all events
                        
                const getAllEvents = async (req, res) => {
                  try {
                    const events = await eventModel.find({});
                    if (events.length === 0) {
                      return res.status(200).json({
                        success: false,
                        message: 'There are no events found',
                      });
                    }
                    const sorted_Event = events.sort(
                      (a, b) => b.createdAt - a.createdAt
                    );
                    res.status(200).json({
                      success: true,
                      message: 'All Events',
                      events_data: sorted_Event,
                    });
                  } catch (error) {
                    return res.status(500).json({
                      success: false,
                      message: 'There is a server error',
                    });
                  }
                };
    
    // API for get user event 
   
    const getUserEvent = async (req, res) => {
      try {
          const userId = req.params.userId;
          const { latest_Update, date, venue_location, event_Type, year, month ,event_type_name} = req.body;
         
          // check for userId
          if (!userId) {
              return res.status(400).json({
                  success: false,
                  message: 'userId required'
              });
          }
  
          const user = await userModel.findOne({ _id: userId });
          if (!user) {
              return res.status(400).json({
                  success: false,
                  message: 'User not found'
              });
          }
  
          const filter = {};
          const filter1 = {};
          
          if (latest_Update) {
              filter.updatedAt = {
                  $gte: new Date(latest_Update),
              };
          }
  
          if (venue_location) {
            filter.city_Name = venue_location; 
            filter1.city_Name = venue_location; 
        }
  
          if (event_Type) {
              filter.event_Type = event_Type;
          }
  
          
                       
          if (month && year) {
              // Initialize an array to store all the dates
              const dates = [];
              const filter1Dates = []; // Array to store dates in YYYY-MM-DD format
          
              // Generate dates from 01 to 31 and store them
              for (let i = 1; i <= 31; i++) {
                  const date = ('0' + i).slice(-2); // Add leading zeros
                  const Month_year = `${date} ${month}, ${year}`;
                  const formattedDate = `${year}-${('0' + (new Date(Date.parse(month + ' 1, 2000')).getMonth() + 1)).slice(-2)}-${date}`; // Convert to YYYY-MM-DD format
                  dates.push(Month_year);
                  filter1Dates.push(formattedDate);
              }
                  
              // Set the filter to match any of the generated dates
              filter['venue_Date_and_time.date'] = dates
              
              // Now you can use this filter to retrieve events
              // Build the query
              const query = eventModel.find(filter);
              
              // Execute the query
              query.exec()
                  .then(events => {
                      // Process events
                  })
                  .catch(err => {
                      // Handle error
                  });
          
              // Now you can use filter1Dates array to filter based on YYYY-MM-DD format
              filter1['venue_Date_and_time.date'] =  filter1Dates 
              
              // Build the query for filter1
              const query1 = InvitedeventModel.find(filter1);
              
              // Execute the query for filter1
              query1.exec()
                  .then(events => {
                      // Process events for filter1
                  })
                  .catch(err => {
                      // Handle error for filter1
                  });
          }        
          
          // Fetch events where the user is the host
          const created_event = await eventModel.find({ userId: userId, ...filter });
                
          // Fetch events where the user is invited
          const invitedEvents = await InvitedeventModel.find({ 'Guests.phone_no': user.phone_no, ...filter1 });
  
          // Add eventType field to distinguish created events and invited events
          const userEventsWithEventType = created_event.map(event => ({
              ...event.toObject(),
              event_type_name: 1 // 1 for created event
          }));
  
          const invitedEventsWithEventType = invitedEvents.map(event => ({
              ...event.toObject(),
              event_type_name: 2 // 2 for Invited event
          }));
  
          // Merge both arrays of events
          let allEvents = [...userEventsWithEventType, ...invitedEventsWithEventType];
  
          // Check if any events were found
          if (allEvents.length === 0) {
              return res.status(200).json({
                  success: false,
                  message: 'No events found for the user',
              });
          }
  
          // Sort all user events by createdAt
          if (date === '1') {
              allEvents = allEvents.sort((a, b) => b.createdAt - a.createdAt); 
          }
  
          let filteredEvents = allEvents;
  
          // Apply filtering based on event_type_name if provided
          if (event_type_name && (event_type_name === '1' || event_type_name === '2')) {
              filteredEvents = allEvents.filter(event => event.event_type_name === parseInt(event_type_name));
          }
  
          const AllfilteredEvent = filteredEvents.sort((a, b) => b.createdAt - a.createdAt);
          return res.status(200).json({
              success: true,
              message: 'User events',
              events: AllfilteredEvent,
          });
      } catch (error) {
          console.error(error);
          return res.status(500).json({
              success: false,
              message: 'There is a server error',
          });
      }
  };
  

                                           /*  Contact Us */
  // API for contact us
                    const contactUsPage = async(req , res) =>{
                      try {
                            const {userName , user_Email , user_phone , message } = req.body
                          
                            const requiredFields = ['userName', 'user_Email' , 'user_phone' , 'message'];
                            for (const field of requiredFields)
                             {
                                if (!req.body[field])
                                 {
                                    return res.status(400).json({
                                        success: false,
                                        message: `Missing ${field.replace('_', ' ')} field`,
                                    });
                                 }
                            }
                            const newData = new contactUs({
                              userName,
                              user_Email,
                              user_phone,
                              message,                        
                             
                          });
                               await newData.save()
                            return res.status(200).json({
                                              success : true ,
                                              successMessage :'contact Us Data',
                                              contactUs_Data : newData
                            })
                      } catch (error) {
                        console.error(error);
                        return res.status(500).json({
                                     success : false ,
                                     serverErrorMessage : 'server Error'
                        })
                      }
                    }

        // API for FAQ 
                      const faqPage = async(req ,res)=>{
                        try {
                               const { userName , user_Email , user_phone  , message } = req.body
                               const requiredFields = ['userName', 'user_Email' , 'user_phone' ,  'message'];
                               for (const field of requiredFields)
                                {
                                   if (!req.body[field])
                                    {
                                       return res.status(400).json({
                                           success: false,
                                           message: `Missing ${field.replace('_', ' ')} field`,
                                       });
                                    }
                               }
                               
                            const newFaqData = new faqModel({
                              userName,
                              user_Email,
                              user_phone,                             
                              message
                            })
                            await newFaqData.save()

                            return res.status(200).json({
                                              success : true ,
                                              successMessage : 'new Faq data inserted successfully ...!' ,
                                              faq_Details : newFaqData
                            })
                        } catch (error) {
                          return res.status(500).json({
                                          success : false ,
                                          serverErrorMessage : 'server Error'
                          })
                        }
                      }         
  
         // APi for send Invitation to event Guests            
         const sendInvitation = async (req, res) => {
          try {
              const { eventId } = req.params;
              const today = new Date();
      
              // Find event
              const event = await eventModel.findOne({ _id: eventId }).populate('Guests');
              if (!event) {
                  return res.status(400).json({
                      success: false,
                      eventExistanceMessage: 'Event not found',
                  });
              }
      
              // Check if the event date is expired
              const eventDate = new Date(event.venue_Date_and_time[0].date);
              if (eventDate < today) {
                  return res.status(200).json({
                      success: false,
                      message: "Event date is expired so you can't send invitations.",
                  });
              }
      
              // Check for existing invited event
              const existInvitedEvent = await InvitedeventModel.findOne({ _id : eventId });
              if (existInvitedEvent) {
                  return res.status(200).json({ success: true, message: 'You already invite guests for this event.' });
              }
      
              // Create invitations object
              const invitation = {
                  userId: event.userId,
                  _id: event._id,
                  userName: event.userName,
                  title: event.title,
                  description: event.description,
                  event_Type: event.event_Type,
                  co_hosts: event.co_hosts,
                  Guests: event.Guests,
                  images: event.images,
                  event_status: event.event_status,
                  event_key : event.event_key,
                  venue_Date_and_time: event.venue_Date_and_time,
                  // event_status: InvitedeventModel.schema.path('event_status').getDefault(),
              };
      
              // Populate Guests array with default status
              invitation.Guests = event.Guests.map(guest => ({
                  Guest_Name: guest.Guest_Name,
                  phone_no: guest.phone_no,
                  status: 2, // Default status: 2 (pending)
              }));
      
              // Save invitation to the database
              await InvitedeventModel.create(invitation);
      
              // Process sending invitations
              let invalidGuests = [];
              for (const guest of event.Guests) {
                  let phone_no_numeric;
                  if (typeof guest.phone_no === 'string') {
                      // Convert the phone number string to a double
                      phone_no_numeric = parseFloat(guest.phone_no);
                  } else {
                      // If it's already a double, assign it directly 
                      phone_no_numeric = guest.phone_no;
                  }
                  const user = await userModel.findOne({ phone_no: phone_no_numeric });
      
                  if (user) {
                      // If user exists, create notification
                      await NotificationModel.create({
                          eventId: event._id,
                          title: event.title,
                          description: event.description,
                          userId: user._id,
                          phone_no: guest.phone_no,
                          event_image: event.images[0].length > 0
                          ? event.images[0]
                          : null,
                          event_location: event.venue_Date_and_time.length > 0 && event.venue_Date_and_time[0].venue_location
                          ? event.venue_Date_and_time[0].venue_location
                          : null,

                          message: `Hello, you are invited to ${event.title} by ${event.userName}`,
                          status : 1
                      });
                  } else {
                      // If user does not exist, push to invalid guests list
                      invalidGuests.push({ Guest_Name: guest.Guest_Name, phone_no: guest.phone_no });
                  }
              }
      
              // Send invitations to invalid guests via SMS
              if (invalidGuests.length > 0) {
                  for (const guest of invalidGuests) {
                      // Convert the phone number string to numeric format
                      const phone_no_numeric = parseInt(guest.phone_no, 10);
                      const formattedPhoneNumber = `+91${phone_no_numeric}`;
                      const message = `Hello, you are invited to ${event.title} by ${event.userName}. Receive updates about the event on the link: https://localhost.com`;
      
                      // Use SMS Gateway Hub to send SMS
                      await sendSMSUsingGatewayHub(formattedPhoneNumber, message);
                  }
              }
      
              res.status(200).json({
                  success: true,
                  message: 'Invitation sent successfully ....!!',
              });
          } catch (error) {
              console.error('Error:', error.response ? error.response.data : error.message);
              res.status(500).json({
                  success: false,
                  message : 'SERVER ERROR',
                  error_message : error.message
              });
          }
      };
      

         
            
      const sendSMSUsingGatewayHub = async (formattedPhoneNumber, message, apiKey = 'DfRvyBzYh02aalLlL4j9Zg', senderId = 'FESSMS') => {
        const gatewayHubApiUrl = 'https://www.smsgatewayhub.com/api/mt/SendSMS';
    
        try {
            // const encodedMessage = encodeURIComponent(message);
    
            const response = await axios.get(gatewayHubApiUrl, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    APIKey: apiKey,
                    senderid: senderId,
                    channel: 2,
                    DCS: 0,
                    flashsms: 0,
                    number: formattedPhoneNumber,
                    text: message,
                    route: 31,
                    EntityId: '1111111111111111111',
                    dlttemplateid: '1111111111111111111',
                    TelemarketerId: 123,
                },
            });
    
            console.log('SMS sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending SMS:', error.response ? error.response.data : error.message);
            throw error;
        }
    };             
    
    const getAllGuest_of_invitation = async (req, res) => {
      try {
        const eventId = req.params.eventId;
    
        // Check if eventId is provided
        if (!eventId) {
          return res.status(400).json({
            success: false,
            message: 'Event Id required',
          });
        }
    
        // Check if the event exists in the event model
        const event = await eventModel.findOne({ _id: eventId });
    
        if (!event) {
          return res.status(200).json({
            success: false,
            message: 'Event not found in event model',
          });
        }
    
        // Check if the invitation event exists in the Invitation table
        const invitationEvent = await InvitedeventModel.findOne({ _id : eventId });
    
        if (!invitationEvent) {
          return res.status(200).json({
            success: false,
            message: 'there is no invitation for the eventId',
          });
        }
    
              
        // Extract the list of guests from the Guests array
        const guestsList = invitationEvent.Guests;
    
        return res.status(200).json({
          success: true,
          message : 'Invited guests Lists',
          guests_list: guestsList,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          serverErrorMessage: 'Server Error',
        });
      }
    };

           
  
  // API for get InvitedEvent of user
                        const getMyInvitation = async (req, res) => {
                          try {
                            const { phone_no } = req.body;

                            if(!phone_no)
                            {
                              return res.status(400).json({
                                       success : false ,
                                       phone_n0_required : 'phone number Required'
                              })
                            }
                           
                            // check for user via phone_no
                            const user = await userModel.findOne({ phone_no: phone_no });
                        
                            if (!user) {
                              return res.status(400).json({
                                success: false,
                                userExistanceMessage: 'user not registerd yet with these number',
                              });
                            }
                        
                            // check if user is a guest in any Invited event
                            const invitedEvents = await InvitedeventModel.find({
                              'Guests.phone_no': phone_no,
                             
                            });
                        
                            if (invitedEvents.length === 0) {
                              return res.status(200).json({
                                success: false,
                                userInvitedMessage: 'you not invited to any event',
                              });
                            }
                        
                            // Extract event details excluding the Guests array for the first event
                            const eventsDetails =  invitedEvents.map(event => {
                              return {
                                ...event.toObject(),
                                Guests: undefined,
                              };
                            });
                            const sortedeventsDetails = eventsDetails.sort(
                              (a, b) => b.createdAt - a.createdAt
                            );
                            return res.status(200).json({
                              success: true,
                              sortedeventsDetails ,
                              

                            });
                            
                          } catch (error) {
                            console.error(error);
                            return res.status(500).json({
                              success: false,
                              serverErrorMessage: 'Server Error',
                            });
                          }
                        };
  
        // APi for update events
        const updateEvent = async (req, res) => {
          try {
            const eventId = req.params.eventId;
            const {
              title,
              description,
              city_Name,
              event_Type,
              sub_event_title,
              venue_Name,
              venue_location,
              date,
              start_time,
              end_time,
              images,
              venue_Date_and_time,
            } = req.body;
        
            // Convert event_key to number if it's a string
            let event_key = req.body.event_key;
        
            if (typeof event_key === 'string') {
              event_key = parseInt(event_key);
            }
        
            // Check for event existence
            const existingEvent = await eventModel.findOne({ _id: eventId });
            if (!existingEvent) {
              return res.status(400).json({
                success: false,
                eventExistanceMessage: 'Event does not exist',
              });
            }
               // Check if req.files exist and if it contains images
         if (req.files && req.files.length > 0) {
             const images = [];
  
        for (const file of req.files) {
          // Ensure that the file is an image
          if (file.mimetype.startsWith('image/')) {
            // If the Event Images already exist, delete the old file if it exists
            if (existingEvent.images && existingEvent.images.length > 0) {
              existingEvent.images.forEach(oldFileName => {
                const oldFilePath = `uploads/${oldFileName}`;
                if (fs.existsSync(oldFilePath)) {
                  fs.unlinkSync(oldFilePath);
                }
              });
            }
            // Add the new image filename to the images array
            images.push(file.filename);
          }
        }
  
        // Update the images with the new one(s) or create a new one if it doesn't exist
        existingEvent.images = images.length > 0 ? images : undefined;
      }
            // Update event details
            if (title) {
              existingEvent.title = title;
            }
            if (description) {
              existingEvent.description = description;
            }
            if (city_Name) {
              existingEvent.city_Name = city_Name;
            }
            if (event_Type) {
              existingEvent.event_Type = event_Type;
            }           
            

            if (event_key === 1) {
              if (existingEvent.event_key === 2) {
                // Empty the venue_Date_and_time array
                existingEvent.venue_Date_and_time = [];
               }
              const venueArrayLength = existingEvent.venue_Date_and_time.length;

        
              if (venueArrayLength === 1) {
                // Update the existing venue details
                const existingVenue = existingEvent.venue_Date_and_time[0];
                existingVenue.sub_event_title = sub_event_title;
                existingVenue.venue_Name = venue_Name;
                existingVenue.venue_location = venue_location;
                existingVenue.date = date;
                existingVenue.start_time = start_time;
                existingVenue.end_time = end_time;
              } else if (venueArrayLength === 0) {
                // Add a new venue
                    if(!venue_Name || !venue_location || !date ||!start_time || !end_time )
                {
                            
                 
                  return res.status(200).json({
                                 success : true ,
                                 successMessage: 'Event updated successfully'
                  })
                }
                else
                {
                  existingEvent.venue_Date_and_time.push({
                    sub_event_title,
                    venue_Name,
                    venue_location,
                    date,
                    start_time,
                    end_time,
                  });
                }
               
              } else {
                // Handle the case where venueArrayLength is greater than 1 (which should not happen)
                return res.status(400).json({
                  success: false,
                  errorMessage: 'Invalid venueArrayLength for event_key 1',
                });
              }
              existingEvent.event_key = event_key
              // Save the updated event back to the database
              await existingEvent.save();
            } 

            else if (event_key === 2) {
              // Initialize venue_details as an empty array
              let venue_details = [];
                   
              // If venue_Date_and_time is provided, process and set the details
              if (venue_Date_and_time) {
                if (venue_Date_and_time !== '') {
                  venue_details = JSON.parse(venue_Date_and_time);
                }
              }
                  if(existingEvent.event_key === 1 || existingEvent.event_key === 0)
                  {
                    existingEvent.venue_Date_and_time = [];
                    existingEvent.venue_Date_and_time.push(...venue_details);
                  }
                  else
                  {
                    
                    existingEvent.venue_Date_and_time.push(...venue_details);
                  }
               
              // Push multiple data at a time to venue_Date_and_time array
              
              existingEvent.event_key = event_key
              await existingEvent.save();
            } else {
              // Handle other event_key values if needed
            }
        
            return res.status(200).json({
              success: true,
              successMessage: 'Event updated successfully',
            });
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              success: false,
              serverErrorMessage: 'Server Error',
            });
          }
        };
        
      
      
  // get event by Id
                          const getEvent = async(req , res) =>{
                            try {
                              const eventId = req.params.eventId;
                          
                              // Validate eventId (you may want to add more validation)
                              if (!eventId) {
                                return res.status(400).json({
                                  success: false,
                                  message: 'Invalid eventId',
                                });
                              }
                          
                              const event = await eventModel.findById(eventId);
                          
                              if (!event) {
                                return res.status(200).json({
                                  success: false,
                                  message: 'Event not found',
                                });
                              }
                          
                              res.status(200).json({
                                success: true,
                                message: 'Event found',
                                event_data: event,
                              });
                            } catch (error) {                              
                              return res.status(500).json({
                                success: false,
                                message: 'There is a server error',
                              });
                            }
                          };
  // APi for get all Envited Event

                           const getAllInvited_Event = async(req ,res)=>{
                            try {
                              const userId = req.params.userId
                              // check for userId
                              if(!userId)
                              {
                                return res.status(400).json({
                                              success : false ,
                                              userIdRequired : 'user Id required'
                                })
                              }

                                    const AllInvited_Events = await InvitedeventModel.find({ 
                                          userId : userId

                                    })

                                    if(!AllInvited_Events)
                                    {
                                      return res.status(200).json({

                                               success : false ,
                                               message : 'there is no invited events here ..!'
                                      })
                                    }
                                          return res.status(200).json({
                                                       success : true ,
                                                        message : 'all Invited Events' ,
                                                        all_Invited_Events : AllInvited_Events
                                          })
                                  } catch (error) {
                              return res.status(500).json({
                                             success : false ,
                                             serverErrorMessage : 'server Error'
                              })
                            }
                           }    
  // APi for get all subEvents  of events
                               const getVenuesOf_Event = async(req ,res)=>{
                                try {
                                       const eventId = req.params.eventId
                                       const event = await eventModel.findOne({ _id : eventId })
                                       if(!event)
                                       {
                                         return res.status(200).json({
                                                                 success : false ,
                                                                 message : 'event not found'
                                         })
                                       }
                                       
                                       const event_venues = event.venue_Date_and_time                                 
                                         return res.status(200).json({
                                                               success : true ,
                                                               message : 'Sub Events ',
                                                               eventId : eventId,
                                                               event_venues : event_venues
                                         })
                                } catch (error) {
                                  return res.status(500).json({
                                                 success : false ,
                                                 serverErrorMessage : 'server Error'
                                  })
                                }
                               }              
                           
// API for give response to Invited event on the behalf of user
const userRespondToInvitedEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { response, event_title, selected_subEvent_Id,selected_subEvent_Names, venueStatus, phone_no } = req.body;

    // Check if the event exists
    const invitedEvent = await InvitedeventModel.findOne({ _id : eventId });

    if (!invitedEvent) {
      return res.status(400).json({
        success: false,
        eventMessage: 'Event not found',
      });
    }

    // Now check if the user exists in userModel using the provided phone_no
    const user = await userModel.findOne({ phone_no });

    if (!user) {
      return res.status(400).json({
        success: false,
        userExistanceMessage: 'User not found ',
      });
    }
           const event_key = invitedEvent.event_key 

    // Check if the user has already responded to the event
    const userResponse = await userResponseEventModel.findOne({
      eventId : eventId ,
      'Guests.phone_no': user.phone_no,
    });

    if (userResponse) {
      return res.status(200).json({
        success: false,
        responseMessage: 'You already responded to the event',
      });
    }     
    if (event_key === 1) {
      const responseMapping = {
        yes: 'accept',
        no: 'reject',
        maybe: 'undecided',
        'yes-multiple': 'accept-all',
        'some-multiple': 'accept-some',
        'no-multiple': 'reject',
      };

      const venueStatus = responseMapping[response] === 'accept' || responseMapping[response] === 'some' ? 1 : responseMapping[response] === 'no' ? 2 : 0;

      const existingUserResponse = await userResponseEventModel.findOne({
        InvitedEventId: invitedEvent._id,
      });

      if (existingUserResponse) {
        existingUserResponse.Guests.push({
          Guest_Name: user.fullName,
          phone_no: user.phone_no,
          status: responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'accept-some' ? 0 : 3,
          venue: invitedEvent.venue_Date_and_time.length === 1 ? invitedEvent.venue_Date_and_time.map((venueDetails, index) => ({
            sub_event_title: venueDetails.sub_event_title,
            venue_status: venueStatus,
          })) : (selected_subEvent_Names && selected_subEvent_Names.length > 0) ? selected_subEvent_Names.map((sub_event_title, index) => ({
            sub_event_title: sub_event_title,
            venue_status: venueStatus,
          })) : [],
          eventId: eventId,
        });

        // existingUserResponse.Guests.forEach(guest => {
        //   guest.venue.forEach(venue => {
        //     venue.venue_status = venueStatus;
        //   });
        // });

        await existingUserResponse.save();
        invitedEvent.Guests.forEach(guest => {
          if (guest.phone_no === user.phone_no) {
            guest.status = responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'accept-some' ? 0 : 3;
          }
        });

        await invitedEvent.save()
      } else {
        const newUserResponse = new userResponseEventModel({
          hostId: invitedEvent.hostId,
          hostName: invitedEvent.hostName,
          InvitedEventId: invitedEvent._id,
          eventId: eventId,
          event_title: invitedEvent.venue_Date_and_time.length === 1 ? event_title : invitedEvent.event_title,
          event_description: invitedEvent.event_description,
          event_Type: invitedEvent.event_key,
          Guests: [
            {
              Guest_Name: user.fullName,
              phone_no: user.phone_no,
              status: responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'accept-some' ? 0 : 3,
              venue: invitedEvent.venue_Date_and_time.length === 1 ? invitedEvent.venue_Date_and_time.map((venueDetails, index) => ({
                sub_event_title: venueDetails.sub_event_title,
                venue_status: venueStatus,
              })) : (selected_subEvent_Names && selected_subEvent_Names.length > 0) ? selected_subEvent_Names.map((sub_event_title, index) => ({
                sub_event_title: sub_event_title,
                venue_status: venueStatus,
              })) : [],
            },
          ],
          images: invitedEvent.images,
        });

        await newUserResponse.save();
        invitedEvent.Guests.forEach(guest => {
          if (guest.phone_no === user.phone_no) {
            guest.status = responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'accept-some' ? 0 : 3;
          }
        });

        await invitedEvent.save();
      }
    } 
                  else if(event_key === 2)
             {
              // Create a single response record for the entire event
    const responseMapping = {
      yes: 'accept',
      no: 'reject',
      maybe: 'undecided',
      yes_multiple: 'accept',
      some_multiple: 'acceptsome',
      no_multiple : 'reject',
    };

    // Check if there is an existing record in userResponseEventModel for the same InvitedEventId
    const existingUserResponse = await userResponseEventModel.findOne({
      InvitedEventId: invitedEvent._id,
    });

    let existingGuest = null;

    if (existingUserResponse) {
      // Check if the guest already exists
      existingGuest = existingUserResponse.Guests.find(guest => guest.phone_no === user.phone_no);

      if (existingGuest) {
        // If the guest exists, update their response
        selected_subEvent_Id.forEach((subEventId, index) => {
          const venueIndex = existingGuest.venue.findIndex(venue => venue.sub_event_Id === subEventId);
          if (venueIndex !== -1) {
            existingGuest.venue[venueIndex].venue_status = venueStatus[index];
          } else {
              
            existingGuest.venue.push({
              sub_event_Id: subEventId,
              sub_event_title: subEventId.sub_event_title, 
              venue_status: venueStatus[index],
            });
          }
        });
      } else {
        // If the guest does not exist, create a new guest object
        existingUserResponse.Guests.push({
          Guest_Name: user.fullName,
          phone_no: user.phone_no,
          status: responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'acceptsome' ? 0 : 3,
          venue: selected_subEvent_Id.map((subEventId, index) => ({
            sub_event_Id: subEventId,
            sub_event_title: subEventId.sub_event_title, 
            venue_status: venueStatus[index],
          })),
          eventId: eventId, 
        });
      }

      // Save the updated record
      await existingUserResponse.save();

      invitedEvent.Guests.forEach(guest => {
        if (guest.phone_no === user.phone_no) {
          guest.status = responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'acceptsome' ? 0 : 3;
        }
      });

      // Save the updated invitedEvent
      await invitedEvent.save();
    } else {
      // Create a new record if it doesn't exist
      const newUserResponse = new userResponseEventModel({
        hostId: invitedEvent.hostId,
        hostName: invitedEvent.hostName,
        InvitedEventId: invitedEvent._id, // Add the InvitedEventId
        eventId: eventId, // Add the eventId
        event_title: invitedEvent.venue_Date_and_time.length === 1 ? event_title : invitedEvent.event_title,
        event_description: invitedEvent.event_description,
        event_Type: invitedEvent.event_key,
        Guests: [{
          Guest_Name: user.fullName,
          phone_no: user.phone_no,
          status: responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'acceptsome' ? 0 : 3,
          venue: selected_subEvent_Id.map((subEventId, index) => ({
            sub_event_Id: subEventId,
            sub_event_title: subEventId.sub_event_title, 
            venue_status: venueStatus[index],
          })),
        }],
        images: invitedEvent.images,
      });

      // Save the new record
      await newUserResponse.save();

      invitedEvent.Guests.forEach(guest => {
        if (guest.phone_no === user.phone_no) {
          guest.status = responseMapping[response] === 'accept' ? 0 : responseMapping[response] === 'reject' ? 1 : responseMapping[response] === 'acceptsome' ? 0 : 3;
        }
      });

      // Save the updated invitedEvent
      await invitedEvent.save();
    }    }
    
    return res.status(200).json({
      success: true,
      responseMessage: 'Event response saved successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      serverErrorMessage: 'Server Error',
    });
  }
};






        // APi for get all Guests with there response for invitation
        const getAllGuest_with_Response = async (req, res) => {
          try {
            const eventId = req.params.eventId;
            const { statuses } = req.body;
        
            // Check if eventId is provided
            if (!eventId) {
              return res.status(400).json({
                success: false,
                message: 'Event Id required',
              });
            }
        
            // Check if the event exists in the event model
            const event = await eventModel.findOne({ _id: eventId });
        
            if (!event) {
              return res.status(404).json({
                success: false,
                message: 'Event not found',
              });
            }
        
            // Check if the invitation event exists in the Invitation table
            const invitationEvent = await InvitedeventModel.findOne({ _id: eventId });
        
            if (!invitationEvent) {
              return res.status(404).json({
                success: false,
                message: 'Invitation event not found',
              });
            }
        
            // Get guests associated with the invitation event
            let guests = invitationEvent.Guests;
        
            // Apply filters based on the statuses provided
            let filteredGuests = guests;
            if (statuses && statuses.length > 0) {
              filteredGuests = guests.filter(guest => statuses.includes(guest.status));
            }
        
            // Prepare response with required fields
            const guestsResponse = filteredGuests.map(guest => ({
              Guest_Name: guest.Guest_Name,
              phone_no: guest.phone_no,
              status: guest.status,
            }));
        
            return res.status(200).json({
              success: true,
              message: 'Invitation response guests Lists',
              guests_list: guestsResponse,
            });
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              success: false,
              serverErrorMessage: 'Server Error',
            });
          }
        };
        
        
        
                            
                    // Api for get response event
                  const getallResponseEvent = async ( req , res )=> {

                         try {                        
                          
                          const responseEvent = await userResponseEventModel.find({})
                          if(!responseEvent)
                          {
                            return res.status(200).json({
                                      success : false ,
                                      message : 'response event not found'
                            })
                          }
                          else
                          {
                            return res.status(200).json({
                                          success : true ,
                                          message : 'Guests response event',
                                          guests_ResponseEvent : responseEvent

                            })
                          }
                         } catch (error) {
                           return res.status(500).json({
                                       success : false ,
                                       serverErrorMessage : 'server Error'
                           })
                         }
                  }

        // APi for get subEvent details of event 
        
        const getSubEventOf_Event = async(req ,res)=>{
          try {
                 const eventId = req.params.eventId
                 const subEventId = req.params.subEventId
                 const event = await eventModel.findOne({ _id : eventId })
                 if(!subEventId)
                 {
                   return res.status(400).json({
                                    success : false ,
                                    subEventIdRequired : 'Sub event ID required'
                   })
                 }
                  // Check if the venue_Date_and_time array exists within event

                  if(!event.venue_Date_and_time || !Array.isArray(event.venue_Date_and_time))
                  {
                    return res.status(400).json({ success : false ,
                                                  message : "date and time array not found in the Event"})
                  }

                // Check for venueIndex
            const existVenueIndex = event.venue_Date_and_time.findIndex(
                (venue) => venue._id.toString() === subEventId
            );
            if (existVenueIndex === -1) {
                return res.status(404).json({ success: false, message: "sub Event not found" });
            }
              else
              {   
                const subEventDetails = event.venue_Date_and_time[existVenueIndex];                              
                   return res.status(200).json({
                                         success : true ,
                                         message : 'Sub Events Details ',
                                         eventId : eventId,
                                         subEvent_Details : subEventDetails                                        
                   })
                  }
          } catch (error) {
            return res.status(500).json({
                           success : false ,
                           serverErrorMessage : 'server Error'
            })
          }
         }      
// APi for delete all Event 
         const deleteAllEvents = async (req, res) => {
          try {
            // Delete all events in the eventModel
            const result = await eventModel.deleteMany({});
        
            if (result.deletedCount === 0) {
              return res.status(400).json({
                success: false,
                message: 'No events found to delete',
              });
            }        
            res.status(200).json({
              success: true,
              message: 'All events deleted successfully',
              deletedCount: result.deletedCount,
            });
          } catch (error) {
            return res.status(500).json({
              success: false,
              message: 'There is a server error',
            });
          }
        };
        
  
  // Api for create event Album
  const createEventAlbum = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const albumName = req.body.albumName;

        if (!eventId) {
            return res.status(200).json({
                success: false,
                eventIdRequired: 'Event Id required fields',
            });
        }

        if (!albumName) {
            return res.status(200).json({
                success: false,
                albumNameRequired: 'albumName required fields',
            });
        }

        // Check for event existence
        const event = await eventModel.findOne({ _id: eventId });

        if (!event) {
            return res.status(200).json({
                success: false,
                eventExistanceMessage: 'Event not found',
            });
        }

        // Create a new album with the provided name
        const newAlbum = new eventImageModel({
            eventId: eventId,
            images: [{
                album_name: albumName,
                image_entries: [],
            }],
        });

        const createdAlbum = await newAlbum.save();

        return res.status(200).json({
            success: true,
            message: 'Album created successfully',
            eventId: event._id,
            album_name: createdAlbum.images[0].album_name,
            album_id: createdAlbum._id,
            createdAt: createdAlbum.createdAt,
            updatedAt: createdAlbum.updatedAt,
            __v: createdAlbum.__v,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            serverErrorMessage: 'Server Error',
        });
    }
};
  
  
  // Api for get all Albums
  const getAllAlbum = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        if (!eventId) {
            return res.status(200).json({
                success: false,
                eventIdRequired: 'Event Id required',
            });
        }

        // Check for event existence in event_Image_Model
        const event = await eventImageModel.findOne({ eventId });

        if (!event) {
            return res.status(200).json({
                success: false,
                message: 'Event not found ',
            });
        }

        // Fetch all Albums from the event_Image_Model
        const allAlbums = await eventImageModel.find({ eventId });

        if (!allAlbums || allAlbums.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No Album found',
            });
        } else {
            const albumsDetails = allAlbums.map(album => {
              
                return {
                    album_id: album._id,
                    album_name: album.images[0].album_name,
                    first_image: album.images[0].image_entries.length > 0
                    ? album.images[0].image_entries[0].image_path
                    : null
                };
            });

            res.status(200).json({
                success: true,
                message: 'All Albums with details',
                allAlbums: albumsDetails,
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            serverError: 'Server error',
        });
    }
};

  
  
  // get particular Album
  

  const getParticularAlbum = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const Album_Id = req.params.Album_Id;

        if (!eventId) {
            return res.status(200).json({
                success: false,
                eventIdRequired: 'Event Id Required',
            });
        }
          const created_event = await eventModel.findOne({ _id : eventId })
          if (!created_event) {
            return res.status(200).json({
                success: false,
                message: 'event not found',
            });
        }
             const userId = created_event.userId

        const event = await eventImageModel.findOne({ eventId });
       

        if (!event) {
            return res.status(200).json({
                success: false,
                message: 'event not found',
            });
        }

        if (!Album_Id) {
            return res.status(200).json({
                success: false,
                albumIdRequired: 'Album Id required',
            });
        }

        const album = await eventImageModel.findOne({ _id: Album_Id }, 'images');

        if (!album) {
            return res.status(200).json({
                success: false,
                message: 'Album not found',
            });
        } else {
            const {  _id: album_id, images } = album;
            const { _id: image_array_id, image_entries , album_name} = images[0];

            return res.status(200).json({
                success: true,
                message: 'Album Details',
                album_name,
                album_id,   
                userId,            
                image_entries
               
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            serverErrorMessage: 'server Error',
        });
    }
};
          // Api for add Images in Album 
          const addImages_in_Album = async (req, res) => {
            try {     
                const album_id = req.params.album_id;
        
                // Check for album id
                if (!album_id) {
                    return res.status(200).json({
                        success: false,
                        albumIdRequired: 'Album Id Required',
                    });
                }
        
                // Check for album existence
                const album = await eventImageModel.findOne({ _id: album_id });
        
                if (!album) {
                    return res.status(200).json({
                        success: false,
                        message: 'Album not found',
                    });
                }
        // Add multiple images as objects with unique ids
        // const imageObjects = [];
        
        // if (req.files && req.files.length > 0) {
        //     req.files.forEach(file => {
        //         const imageObject = {
        //             image_path: file.filename,
        //         };
        //         imageObjects.push(imageObject);
        //     });
        // }

       
        // const defaultImageArray = album.images[0];

        // // Add image objects to image_entries array
        // defaultImageArray.image_entries.push(...imageObjects);


        // upload single 
        const imageObject = {
          image_path: req.file.filename, 
       };

      const defaultImageArray = album.images[0];

      // Add image object to image_entries array
      defaultImageArray.image_entries.push(imageObject);

        // Save the updated album
        await album.save();

        return res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            image_objects: imageObject,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            serverErrorMessage: 'Server Error',
        });
    }
};

        
    // Api for rename Album
            const rename_album = async(req ,res)=>{
              try {
                      const album_id = req.params.album_id
                      const new_album_name = req.body.new_album_name
                    // check for albumId
                  if(!album_id)
                  {
                    return res.status(200).json({
                                 success : false ,
                                 message : 'album Id required'
                    })
                  }

              // check for album
              const album = await eventImageModel.findOne({ _id : album_id }, 'images')
              if(!album)
              {
                return res.status(200).json({
                            success : false ,
                            message : 'album not exist'
                })
              }
              album.images[0].album_name = new_album_name;
              await album.save();

              return res.status(200).json({
                       success : true ,
                       message : 'album Renamed Successfully'
              })
              } catch (error) {
                return res.status(500).json({
                           success : false ,
                           serverErrorMessage : 'server Error '
                })
              }
            }

            // Api for delete particular Album
                const deleteAlbum = async(req ,res)=>{
                  try {
                           const album_id = req.params.album_id
                        // check for album id
                        if(!album_id)
                        {
                          return res.status(200).json({
                                       success : false ,
                                       message : 'album Id Required'
                          })
                        }

                        // check for album
                        const album = await eventImageModel.findOneAndDelete({ _id : album_id })
                        if(!album)

                        {
                          return res.status(200).json({
                                      success : false ,
                                      message : 'album not exist'
                          })
                        }
                        else
                        {
                          return res.status(200).json({
                                           success : true,
                                           message : 'album deleted successfully'
                          })
                        }
                  } catch (error) {
                          return res.status(500).json({
                                       success : false ,
                                       serverErrorMessage : 'server Error'
                          })
                  }
                }

          // APi for delete particular image in album
                          const deleteImage = async(req ,res)=>{
                            try {
                                 const { image_id , album_id } = req.params
                                 //check required fields
                                 if(!image_id)
                                 {
                                  return res.status(200).json({
                                           success : false ,
                                           image_id_Required : 'image id required'
                                  })
                                 }
                                
                                 if(!album_id)
                                 {
                                  return res.status(200).json({
                                           success : false ,
                                           album_id_Required : 'album_id required'
                                  })
                                 }

                                 // check for album
                                 const album = await eventImageModel.findOne({ _id : album_id })
                                 if(!album)
                                 {
                                  return res.status(200).json({
                                               success : false ,
                                               album_required : 'Album not exist'
                                  })
                                 }

                                 // check for image in the specified image array

                                 let image_found = false

                                 album.images.forEach(imageArray => {
                                  const imageIndex = imageArray.image_entries.findIndex(entry => 
                                        entry._id.toString() === image_id)

                                        if(imageIndex !== -1 )
                                        {
                                            imageArray.image_entries.splice(imageIndex , 1)

                                            image_found = true
                                        }
                                 })

                                    if(!image_found)
                                    {
                                      return res.status(200).json({
                                          success : false ,
                                          message :'image not found'
                                      })
                                    }

                                       await album.save()

                                       return res.status(200).json({
                                             success : true,
                                             message : 'Image Deleted successfully'
                                       })
                            }
                             catch (error) {
                              return res.status(500).json({
                                         success : false ,
                                         serverErrorMessage : 'server Error'
                              })
                            }
                          }


        // Api for get event according to date

       
        const { parse, format, eachDayOfInterval } = require('date-fns');


        const get_Event_on_date = async (req, res) => {
          try {
              const userId = req.params.userId;
              const { month, year, dates } = req.body;
      
              // Check for userId
              if (!userId) {
                  return res.status(200).json({
                      success: false,
                      userId_required: 'userId required',
                  });
              }
      
              const user = await userModel.findOne({ _id: userId });
              if (!user) {
                  return res.status(200).json({
                      success: false,
                      userExistanceMessage: 'user not found',
                  });
              }
      
              const phone_no = user.phone_no;
      
              if (dates && month && year) {
                  const parsedDate = parse(`${month} ${year}`, 'MMM yyyy', new Date());
                  const startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
                  const endDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);
                  const allDatesInMonth = eachDayOfInterval({ start: startDate, end: endDate });
      
                  const eventDetails = [];
                  const created_event_Details = [];
                  const invited_event_details = [];
      
                  for (const date of allDatesInMonth) {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const formattedDate = `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
      
                      // Check if the current date is the specified date
                      if (formattedDate === dates) {
                          const created_events = await eventModel.find({
                              userId: userId,
                              'venue_Date_and_time.date': formattedDate,
                          });
                          var dateObj = new Date(formattedDate);

                        // Extract year, month, and day from the date object
                        var year1 = dateObj.getFullYear();
                        var month1 = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because JavaScript months are zero-based
                        var day1 = dateObj.getDate().toString().padStart(2, '0');

                        // Form the desired date string in the format "YYYY-MM-DD"
                        var formattedDates = year1 + "-" + month1 + "-" + day1;
                          const invitedEvents = await InvitedeventModel.find({
                              'Guests.phone_no': phone_no,
                              'venue_Date_and_time.date': formattedDates,
                          });
      
                          created_event_Details.push(...created_events.map(event => ({ ...event._doc, event_type_name: 1 })));
                          invited_event_details.push(...invitedEvents.map(event => ({ ...event._doc, event_type_name: 2 })));

                        
      
                          eventDetails.push({
                              date: formattedDate,
                              created_eventCount: created_events.length,
                              invited_eventCount: invitedEvents.length,
                          });
                      } else {
                          // If the current date is not the specified date, push an empty entry
                          eventDetails.push({
                              date: formattedDate,
                              created_eventCount: 0,
                              invited_eventCount: 0,
                          });
                      }
                  }
                  const allEvents = [...created_event_Details, ...invited_event_details];
                  return res.status(200).json({
                      success: true,
                      message: 'Event Details',
                      eventDetails: eventDetails,
                      allEvents : allEvents
                  });
              } else if (month && year) {
                  // Handle logic for monthly events
                  const parsedDate = parse(`${month} ${year}`, 'MMM yyyy', new Date());
                  const startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
                  const endDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);
                  const allDatesInMonth = eachDayOfInterval({ start: startDate, end: endDate });
      
                  const eventDetails = [];
                  const created_event_Details = [];
                  const invited_event_details = [];
      
                  for (const date of allDatesInMonth) {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const formattedDate = `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
      
                      const events = await eventModel.find({
                          userId: userId,
                          'venue_Date_and_time.date': formattedDate,
                      });
                        var dateObj = new Date(formattedDate);

                      // Extract year, month, and day from the date object
                      var year1 = dateObj.getFullYear();
                      var month1 = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because JavaScript months are zero-based
                      var day1 = dateObj.getDate().toString().padStart(2, '0');

                      // Form the desired date string in the format "YYYY-MM-DD"
                      var formattedDates = year1 + "-" + month1 + "-" + day1;
                     
                      const invitedEvents = await InvitedeventModel.find({
                          'Guests.phone_no': phone_no,
                          'venue_Date_and_time.date': formattedDates,
                      });
      
                      created_event_Details.push(...events.map(event => ({ ...event._doc, event_type_name: 1 })));
                      invited_event_details.push(...invitedEvents.map(event => ({ ...event._doc, event_type_name: 2 })));
      
      
                      eventDetails.push({
                          date: formattedDate,
                          created_eventCount: events.length,
                          invited_eventCount: invitedEvents.length,
                      });
                  }
                  const allEvents = [...created_event_Details, ...invited_event_details];
                  return res.status(200).json({
                      success: true,
                      message: 'Event Details',
                      eventDetails: eventDetails,
                      allEvents : allEvents
                  });
              } else {
                  // Handle case where neither date nor month/year is provided
                  return res.status(200).json({
                      success: false,
                      date_required: 'date or month and year are required',
                  });
              }
          } catch (error) {
              console.error(error);
              return res.status(500).json({
                  success: false,
                  message: 'Server error',
              });
          }
      };
      


                                                  /* Event Feed Section */
      // Api for create  feed in event

      const create_feed = async (req, res) => {
        try {
          const { eventId , userId } = req.params;
          const { feed_description } = req.body;
      
          // check for eventId 
          if (!eventId) {
            return res.status(200).json({
              success: false,
              message: 'Event Id required'
            });
          }
      
          // check for eventId 
          if (!eventId) {
            return res.status(200).json({
              success: false,
              message: 'Event Id required'
            });
          }
      
          // check for event Existence
          const event = await eventModel.findOne({ _id: eventId });
          if (!event) {
            return res.status(200).json({
              success: false,
              message: 'Event not found'
            });
          }   
        

          //check for user
         const user = await userModel.findOne({
                      _id: userId
         })
           const user_profileImage = user.profileImage
           const userName =  user.fullName
      
          // check for feed description field
          if (!feed_description) {
            return res.status(200).json({
              success: false,
              message: 'Feed description required'
            });
          }
      
          // Initialize the review section with default values
          const defaultReview = {
            likes: 0,
            comments: [],
            views: 0
          };
      
          // image upload for post
          const Image = req.file ? req.file.filename : null;
      
          // Create a new event feed using the schema
          const newEventFeed = new eventFeedModel({
            userId: userId,
            userName: userName,
            user_profileImage: user_profileImage,
            eventId: eventId,
            feed_description: feed_description,
            feed_image: Image,
            review: defaultReview
          });
      
          // Save the new event feed to the database
          await newEventFeed.save();
      
          return res.status(200).json({
            success: true,
            message: 'Event feed created successfully',
            feed_Id : newEventFeed._id
          });
      
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: 'Server error'
          });
        }
      };
      
  // api for get all feeds 
                    const get_allfeeds = async (req, res) => {
                      try {
                        const eventId = req.params.eventId;
                    
                        // Check for eventId
                        if (!eventId) {
                          return res.status(200).json({
                            success: false,
                            message: 'Event Id is required'
                          });
                        }
                    
                        // Check for all feeds
                        const all_feeds = await eventFeedModel.find({ eventId: eventId });
                    
                        if (!all_feeds || all_feeds.length === 0) {
                          return res.status(200).json({
                            success: false,
                            message: 'No feeds found for the event'
                          });
                        } else {
                          // Map each feed to extract necessary information
                          const formattedFeeds = all_feeds.map(feed => {
                            const originalDate = new Date(feed.createdAt);
                            const formattedDate = `${originalDate.getUTCFullYear()}-${(originalDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${originalDate.getUTCDate().toString().padStart(2, '0')} ${originalDate.getUTCHours().toString().padStart(2, '0')}:${originalDate.getUTCMinutes().toString().padStart(2, '0')}:${originalDate.getUTCSeconds().toString().padStart(2, '0')}`;
                    
                            return {
                              feed_id: feed._id,
                              eventId: feed.eventId,
                              userId: feed.userId,
                              userName: feed.userName,
                              user_profileImage: feed.user_profileImage,
                              feed_description: feed.feed_description,
                              feed_image: feed.feed_image,
                              feed_created_time: formattedDate,
                              feed_likes: feed.feed_review ? feed.feed_review.like_count || 0 : 0,
                              feed_comments: feed.feed_review ? feed.feed_review.comment_count || 0 : 0,
                              feed_views: feed.feed_review ? feed.feed_review.view_count || 0 : 0
                            };
                          });
                    
                          return res.status(200).json({
                            success: true,
                            message: 'All feeds details for the event',
                            feeds: formattedFeeds
                          });
                        }
                      } catch (error) {
                        console.error(error);
                        return res.status(500).json({
                          success: false,
                          message: 'Server error'
                        });
                      }
                    };
                    
                    
  

// APi for delete user feed
                  const delete_user_feed = async (req, res) => {
                    try {
                      const { userId , feed_Id} = req.params;

                      if (!userId) {
                        return res.status(200).json({
                          success: false,
                          message: 'UserId required',
                        });
                      }
                      if (!feed_Id) {
                        return res.status(200).json({
                          success: false,
                          message: 'feed_Id required',
                        });
                      }

                      // Check for feed
                      const feed = await eventFeedModel.findOne({ 
                            userId: userId ,
                            _id : feed_Id });

                      if (!feed) {
                        return res.status(200).json({
                          success: false,
                          message: 'Feed not found',
                        });
                      } else {
                        // Delete the feed
                        await eventFeedModel.deleteOne({ userId: userId , _id : feed_Id });

                        return res.status(200).json({
                          success: true,
                          message: 'Feed deleted successfully',
                        });
                      }
                    } catch (error) {
                      return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message,
                      });
                    }
                  };

// APi for give like/ unlike to feed in event
                const like_unlike_feed = async (req, res) => {
                  try {
                    const { feed_Id, userId } = req.params;

                    // check for userId and feed_Id required
                    if (!userId) {
                      return res.status(200).json({
                        success: false,
                        message: 'userId required'
                      });
                    }
                    if (!feed_Id) {
                      return res.status(200).json({
                        success: false,
                        message: 'feed Id required'
                      });
                    }

                    // check for feed existence
                    const feed = await eventFeedModel.findOne({ _id: feed_Id });
                    if (!feed) {
                      return res.status(200).json({
                        success: false,
                        message: 'feed not found'
                      });
                    }

                    // check for user existence
                    const user = await userModel.findOne({ _id: userId });
                    if (!user) {
                      return res.status(200).json({
                        success: false,
                        message: 'user not found'
                      });
                    }

                    // check if the user already liked the feed
                    const likedIndex = feed.feed_review.likes.indexOf(userId);
                    

                    if (likedIndex >= 0) {
                      // User has already liked, so unlike
                      feed.feed_review.likes.splice(likedIndex, 1);
                      feed.feed_review.like_count -= 1; // Update like count
                      await feed.save();

                      return res.status(200).json({
                        success: true,
                        message: 'Feed unliked successfully',
                        isLiked: 0 // Set isLiked to 0 for unlike
                      });
                    } else {
                      // User has not liked, so like
                      feed.feed_review.likes.push(userId);
                      feed.feed_review.like_count += 1; // Update like count
                      await feed.save();

                      return res.status(200).json({
                        success: true,
                        message: 'Feed liked successfully',
                        isLiked: 1 // Set isLiked to 1 for like
                      });
                    }
                  } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                      success: false,
                      message: 'Server error'
                    });
                  }
                };


// API for add comments in feed
                  const add_comments = async (req, res) => {
                    try {
                      const { userId, feed_Id } = req.params;
                      const comment = req.body.comment;

                      // check for feed_id and userId required
                      if (!feed_Id) {
                        return res.status(200).json({
                          success: false,
                          message: 'feed_Id is required',
                        });
                      }

                      if (!userId) {
                        return res.status(200).json({
                          success: false,
                          message: 'user Id required',
                        });
                      }

                      // check for comment required
                      if (!comment) {
                        return res.status(200).json({
                          success: false,
                          message: 'comment section is required',
                        });
                      }

                      // check for feed
                      const feed = await eventFeedModel.findOne({ _id: feed_Id });

                      if (!feed) {
                        return res.status(200).json({
                          success: false,
                          message: 'feed not found',
                        });
                      }

                      // check for user
                      const user = await userModel.findOne({ _id: userId });

                      if (!user) {
                        return res.status(200).json({
                          success: false,
                          message: 'user not exist',
                        });
                      }

                      // access user name from user
                      const userName = user.fullName;
                      const user_image =  user.profileImage

                      // push the comment in feed comment array of feed_review
                      const newComment = {
                        userName: userName,
                        user_image : user_image,
                        text_comment: comment,
                      };

                      feed.feed_review.comments.push(newComment);
                      feed.feed_review.comment_count += 1;

                      // Save the updated feed
                      await feed.save();

                      return res.status(200).json({
                        success: true,
                        message: 'Comment added successfully',
                        comment: newComment,
                      });
                    } catch (error) {
                      return res.status(500).json({
                        success: false,
                        message: 'server error',
                        error_message: error.message,
                      });
                    }
                  };


          // api for get all comments in feed of event

               const get_all_comments = async ( req ,res)=>{
                    try { 
                           const { feed_Id } = req.params
                        // check for feed Id required
                      if(!feed_Id)
                      {
                        return res.status(200).json({
                                     success : false ,
                                     message : 'feed Id Required'
                        })
                      }

                      // check for feed existance
                    const feed = await eventFeedModel.findOne({ _id : feed_Id })

                         if(!feed)
                         {
                          return res.status(200).json({
                                    success : false ,
                                    message : 'feed not found'
                          })
                         }
                         
                      const comments = feed.feed_review.comments
                          return res.status(200).json({
                                      success : true ,
                                      message : 'all comments of the feed ',
                                      all_comments : comments
                          })                      
                    } catch (error) {
                      return res.status(500).json({
                           success : false ,
                           message : 'server error'
                      })
                    }
               }

        
     // Api for create views on feed
     const viewFeed = async (req, res) => {
      try {
        const { feed_Id, userId } = req.params;
    
        // check for feed_id
        if (!feed_Id) {
          return res.status(200).json({
            success: false,
            message: 'Feed Id required',
          });
        }
    
        // check  user_id
        if (!userId) {
          return res.status(200).json({
            success: false,
            message: 'userId Id required',
          });
        }
    
        // check for feed
        const feed = await eventFeedModel.findOne({ _id: feed_Id });
    
        if (!feed) {
          return res.status(200).json({
            success: false,
            message: 'Feed not exist',
          });
        }
    
        // Ensure that the 'views' property is initialized as an array
        feed.feed_review.views = feed.feed_review.views || [];
    
        // Check if the user has already viewed this feed
        if (!feed.feed_review.views.includes(userId)) {
          // Increment both view_count and add userId to views array
          feed.feed_review.views.push(userId);
          feed.feed_review.view_count += 1;
          await feed.save();
    
          return res.status(200).json({
            success: true,
            message: 'User viewed feed successfully',
            views: feed.feed_review.views.length,
            view_count: feed.feed_review.view_count,
          });
        } else {
          // User with the same userId has already viewed, no change in counts
          return res.status(200).json({
            success: true,
            message: 'User viewed feed successfully',
            views: feed.feed_review.views.length,
            view_count: feed.feed_review.view_count,
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    };
    
    
    // Api for get notification of user
    
    const getNotification_of_user = async (req, res) => {
      try {
          const userId = req.params.userId;
          
          // Check if userId is provided
          if (!userId) {
              return res.status(400).json({
                  success: false,
                  message: 'User ID is required'
              });
          }
  
          // Fetch notifications from both models
          const notifications = await Promise.all([
              NotificationModel.find({ userId }),
              UsersNotificationModel.find({ userId })
          ]);
  
          // Combine notifications from both models into a single array
          const combinedNotifications = notifications.flat();
            
          // Check if no notifications are found
          if (combinedNotifications.length === 0) {
              return res.status(200).json({
                  success: false,
                  message: 'No notifications found for the user'
              });
          }
  
          // Send the combined notifications as response
          return res.status(200).json({
              success: true,
              message: 'User notifications',
              Notification_count : combinedNotifications.length,
              notifications: combinedNotifications.map(notification => ({
                  notification_id: notification._id,
                  userId: notification.userId,
                  message: notification.message,
                  title: notification.title,                  
                  event_image : notification.event_image,
                  date : notification.createdAt,
                  event_location : notification.event_location,
                  status : notification.status


              }))
          });
      } catch (error) {
          return res.status(500).json({
              success: false,
              message: 'Server error',
              error_message: error.message
          });
      }
  };
  
  
  const deleteNotificationById = async (req, res) => {
    try {
        const notification_id = req.params.notification_id;

        // Check for notification_id
        if (!notification_id) {
            return res.status(400).json({
                success: false,
                message: 'Notification ID is required'
            });
        }

        // Check for notification in NotificationModel
        let notification = await NotificationModel.findOne({ _id: notification_id });

        // Check for notification in UsersNotificationModel if not found in NotificationModel
        if (!notification) {
            notification = await UsersNotificationModel.findOne({ _id: notification_id });
        }

        if (notification) {
            // Delete the notification from the database
            await notification.deleteOne();
            
            return res.status(200).json({
                success: true,
                message: 'Notification deleted successfully'
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Notification not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};


// APi for change notification status
const changeNotification_status = async (req, res) => {
  try {
      const notification_id = req.params.notification_id;

      // check for required fields
      if (!notification_id) {
          return res.status(400).json({
              success: false,
              message: 'Notification Id required'
          });
      }

      // Check for notification in both models
      let notification = await NotificationModel.findOne({ _id: notification_id });

      if (!notification) {
          notification = await UsersNotificationModel.findOne({ _id: notification_id });
      }

      if (notification) {
          // Update the notification status
          notification.status = 0;
          await notification.save();

          return res.status(200).json({
              success: true,
              message: 'Notification seen '
          });
      } else {
          return res.status(404).json({
              success: false,
              message: 'Notification not found'
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
          success: false,
          message: 'Server error'
      });
  }
};


// get event by Id
const getInvitedEvent = async(req , res) =>{
  try {
    const eventId = req.params.eventId;

    // Validate eventId (you may want to add more validation)
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid eventId',
      });
    }

    const event = await InvitedeventModel.findOne({ _id : eventId } );

    if (!event) {
      return res.status(200).json({
        success: false,
        message: 'Event not found',
      });
    }
       const userId = event.userId
       // check for user
       const user = await userModel.findOne({ _id : userId })
       const user_phone = user.phone_no
    res.status(200).json({
      success: true,
      message: 'Event found',
      event_data: {
                   userName : event.userName,
                   title : event.title,
                   description : event.description,
                   event_type : event.event_Type,
                   images : event.images,
                   user_phone : user_phone,
                   venue_location : event.venue_Date_and_time[0].venue_location,
                   venue_Name : event.venue_Date_and_time[0].venue_Name,
                   date : event.venue_Date_and_time[0].date,
                   start_time :event.venue_Date_and_time[0].start_time,
                   end_time : event.venue_Date_and_time[0].end_time,

                   venue_Date_and_time : event.venue_Date_and_time
      
      }
        
    });
  } catch (error) {                              
    return res.status(500).json({
      success: false,
      message: 'There is a server error',
    });
  }
};



                                      /*   Todo Section */

    // Api for create todo list
    const createTodo = async (req, res) => {
      try {
          const userId = req.params.userId;
          const { title, description, date, due_on, status, assign_to } = req.body;
  
          // Check for required fields
          const requiredFields = ['title', 'description', 'date', 'due_on', 'status', 'assign_to'];
          for (const field of requiredFields) {
              if (!req.body[field]) {
                  return res.status(400).json({
                      success: false,
                      message: `${field} is required`
                  });
              }
          }
  
          if (!userId) {
              return res.status(400).json({
                  success: false,
                  message: 'userId required'
              });
          }
  
          // Check for user
          const user = await userModel.findOne({
              _id: userId
          });
  
          if (!user) {
              return res.status(400).json({
                  success: false,
                  message: 'User not found'
              });
          }
  
          // Extract userName and profileImage from the user
          const { fullName: userName, profileImage: user_profileImage } = user;
  
          // Attach the file or document in todo_attachment
          let attachment = req.file.filename;
          
  
          const newTodo = new todoModel({
              title,
              userId,
              userName,
              user_profileImage,
              description,
              date,
              due_on,
              status,              
              assign_to,
              todo_attachment : attachment
          });
  
          await newTodo.save();
  
          return res.status(200).json({
              success: true,
              message: 'Todo list created',
              todoList: newTodo
          });
      } catch (error) {
          return res.status(500).json({
              success: false,
              message: 'Server error',
              error_message: error.message
          });
      }
  };
  

  // APi for get all todo list of the user

       const allTodos_of_user = async ( req ,res)=>{
        try {
              const userId = req.params.userId
              // check for userId
            if(!userId)
            {
              return res.status(400).json({
                  success : false ,
                  message : 'user id required'
              })
            }

            // check for user
          const user_todos = await todoModel.find({ userId : userId })

          if(!user_todos)
          {
            return res.status(200).json({
                  success : false ,
                  message : 'no todos list found for the user'
            })
          }
           else
           {
            return res.status(200).json({
                      success : true ,
                      message : 'user todos lists',
                      todo_lists : user_todos
            })
           }
        } catch (error) {
          return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
          })
        }
       }
  
      // Api for get particular todo
         const getParticular_todo = async ( req , res)=> {
          try {
                    const todo_id = req.params.todo_id
                  // check for required fields 
                      if(!todo_id)
                      {
                        return res.status(400).json({
                               success : false ,
                               message : 'todo Id required'
                        })
                      }

                      // check for todo
                      const todo = await todoModel.findOne({ _id : todo_id })
                      if(!todo)
                      {
                        return res.status(200).json({
                               success : false ,
                               message : 'todo not found'
                        })
                      }
                      else
                      {
                        return res.status(200).json({
                             success : true ,
                              message : 'todo details',
                              todo_details : todo
                        })
                      }
          } catch (error) {
               return res.status({
                      success : false ,
                      message : 'server error'
               })
          }
         }
      
    // update particular todo
                  const update_todo = async ( req , res )=>{
                    try {
                            const todo_id = req.params.todo_id
                            const { title, description, date, due_on, status, assign_to } = req.body;
                        // check for required fields

                         if(!todo_id)
                         {
                          return res.status(400).json({
                              success : false ,
                              message : 'todo Id required'
                          })
                         }
                        
                         // check for exist todo

                         const exist_todo = await todoModel.findOne({ _id : todo_id })
                         if(!exist_todo)
                         {
                          return res.status(200).json({
                                  success : false ,
                                  message : 'no todo details found'
                          })
                         } 

                         const attachement = req.file.filename

                         exist_todo.title = title
                         exist_todo.description  = description
                         exist_todo.date = date
                         exist_todo.due_on = due_on
                         exist_todo.status = status
                         exist_todo.assign_to = assign_to
                         exist_todo.todo_attachment = attachement

                         await exist_todo.save()
                         return res.status(200).json({
                           success : true ,
                           message : 'todo list updated'
                         })
  
                    } catch (error) {
                      return res.status(500).json({
                          success : false ,
                          message : 'server error'
                      })
                    }
                  }

      // Api for delete particular todo
                    const deleteTodo = async( req ,res)=>{
                      try { 
                             const todo_id = req.params.todo_id
                        // check for todo_id as required
                      if(!todo_id)
                      {
                        return res.status(400).json({
                                success : false ,
                                message : 'todo Id required'
                        })
                      }

                      // check for todo
                       const todo = await todoModel.findByIdAndDelete({ _id : todo_id })

                        if(!todo)
                        {
                          return res.status(200).json({
                             success : false ,
                             message : 'todo not found',

                          })
                        }
                        else
                        {
                          return res.status(200).json({
                                   success : true ,
                                   message : 'todo deleted successfully'
                          })
                        }
                        
                      } catch (error) {
                        return res.status(500).json({
                              success : false ,
                              message : 'server error'
                        })
                      }
                    }
        
        // Api for get city name of event created by user
        const get_city_name = async (req, res) => {
          try {
              const userId = req.params.userId;
      
              // Check for required fields
              if (!userId) {
                  return res.status(400).json({
                      success: false,
                      message: 'User ID required'
                  });
              }
      
              // Check for user events
              const userEvents = await Promise.all([
                  eventModel.find({ userId: userId }),
                  InvitedeventModel.find({ userId: userId })
              ]);
      
              // Merge user created and invited events into a single array
              const mergedEvents = [].concat(...userEvents);
      
              if (!mergedEvents || mergedEvents.length === 0) {
                  return res.status(200).json({
                      success: false,
                      message: 'No events found for the user'
                  });
              }
      
              // Accumulate unique city names
              const uniqueCityNames = Array.from(new Set(mergedEvents.map(event => event.city_Name)));
      
              return res.status(200).json({
                  success: true,
                  message: 'All unique city names',
                  city_Name: uniqueCityNames.map(city => ({ city: city })) // Format the city names as an array of objects
              });
          } catch (error) {
              return res.status(500).json({
                  success: false,
                  message: 'Server error'
              });
          }
      }
  // get all collections created by user
      const getAllCollections_of_user = async (req, res) => {
        try {
              const userId = req.params.userId
            
            // Fetch all collections from the bookmarkModel
            const allCollections = await bookmarkModel.find({ userId  });
    
            if (!allCollections || allCollections.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No collections found',
                });
            } else {
                const collectionDetails = allCollections.map(collections => {
                  
                    return {
                        collection_id: collections._id,
                        collection_name: collections.bookmark_Collection[0].name,
                        collection_created_date : collections.createdAt,
                        collection_entries_count : collections.bookmark_Collection[0].bookmark_entries.length
    
    
                        // bookmark_entries : collections.bookmark_Collection[0].bookmark_entries
                    };
                });
    
                res.status(200).json({
                    success: true,
                    message: 'All bookmark collections',
                    allCollections: collectionDetails,
                });
            }
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    };
    
      
            module.exports = {
                    userSignUp , userLogin , create_Event , newVenue_Date_Time , add_co_host ,
                     edit_Venue_Date_Time , delete_Venue_Date_Time , add_guest , import_Guest ,
                     getAllGuest  , addAllGuestsToBookmark , deleteGuestInCollection , searchEvent ,
                      feedback , deleteEvent , deleteUser , getImages , delete_co_Host , getAllEvents,
                     getUserEvent   , contactUsPage , faqPage , sendInvitation , getMyInvitation , updateEvent , getEvent,
                     getAllInvited_Event , getVenuesOf_Event , userRespondToInvitedEvent , getAll_co_Hosts , getAllGuest_with_Response ,
                     delete_Guest , getallResponseEvent , updateUser , numberExistance , getSubEventOf_Event , getUser , deleteAllEvents ,
                     createEventAlbum , getAllAlbum , getParticularAlbum , addImages_in_Album , rename_album , deleteAlbum , deleteImage ,
                     get_Event_on_date , create_feed , get_allfeeds , delete_user_feed , like_unlike_feed , add_comments , get_all_comments ,
                     viewFeed  , getNotification_of_user , getAllGuest_of_invitation , deleteNotificationById , getInvitedEvent , createTodo,
                     allTodos_of_user , getParticular_todo , update_todo , changeNotification_status , deleteTodo , get_city_name ,
                     getAllCollections_of_user
}