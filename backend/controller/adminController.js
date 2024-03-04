const cors = require('cors')
const upload = require('../utils/uploads')
const fs = require('fs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const eventModel = require('../models/eventModel')
const Admin = require('../models/AdminModel')
const bcrypt = require('bcrypt')
const tokenModel = require('../models/tokenModel')
const Adminforgetpass_sentEmail = require('../utils/AdminSendEmails')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const bookmarkModel = require('../models/bookmarkModel')
const feedbackModel = require('../models/feedbackModel')
const termAndConditionModel = require('../models/termAndConditionModel')
const privacyAndPolicyModel = require('../models/privacy&PolicyModel')
const userModel = require('../models/userModel')
const AdminNotificationDetail = require ('../models/AdminNotification')
const UsersNotificationModel = require('../models/userNotifications')
const notificationEmail = require('../utils/AdminSendEmails')
const contactUs = require('../models/contactUs')
const faqModel = require('../models/FaQ')
const InvitationModel = require('../models/Invitation')
const { all } = require('../routes/userRoutes')

                                             /* API's  */
// API for login ADMIN 
const login_Admin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find Admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Email incorrect', success: false });
        }

        // Check if the stored password is in plain text
        if (admin.password && admin.password.startsWith('$2b$')) {
            // Password is already bcrypt hashed
            const passwordMatch = await bcrypt.compare(password, admin.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Password incorrect', success: false });
            }
        } else {
            // Convert plain text password to bcrypt hash
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            // Update the stored password in the database
            admin.password = hashedPassword;
            await admin.save();
        }

        return res.json({ message: 'Admin Login Successful', success: true, data: admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


         // APi for change password
                     const changePassword = async (req,res)=>{
                        try {
                            const id = req.params.id
                            const {oldPassword , newPassword , confirmPassword} = req.body
                           
                            if(!oldPassword)
                            {
                              return res.status(400).json({
                                                 success : false ,
                                                 oldPasswordMessage : 'old password required'
                              })
                            }
                            if(!newPassword)
                            {
                              return res.status(400).json({
                                                 success : false ,
                                                 NewPasswordMessage : 'newPassword required'
                              })
                            }
                            if(!confirmPassword)
                            {
                              return res.status(400).json({
                                                 success : false ,
                                                 confirmPasswordMessage : 'confirmPassword required'
                              })
                            }
                           
                                   // check if new Password is matched with confirm password
                                if(newPassword !== confirmPassword)
                                {
                                    return res.status(400).json({
                                                         success : false ,
                                                         passwordMatchMessage  : 'password not matched'
                                    })
                                }  
                            
                                // check for admin
                                const admin = await Admin.findOne({ _id:id})
                                if(!admin)
                                {
                                    res.status(400).json({
                                                  success : false ,
                                                  checkAdminMessage : ' admin not found'
                                    })
                                }
                                else
                                {
                                   const isOldPasswordValid = await bcrypt.compare(oldPassword , admin.password)
                                      if(!isOldPasswordValid)
                                      {
                                        return res.status(400).json({
                                                           success : false ,
                                                           OldPasswordValidMessage : 'old password not valid'
                                        })
                                      }

                                      // bcrypt the old password
                                      const hashedNewPassword = await bcrypt.hash(newPassword , 10)
                                      admin.password = hashedNewPassword
                                      await admin.save()

                                      return res.status(200).json({
                                                               success : true ,
                                                               successMessage : 'password change successfully'
                                      })
                                }
                        } catch (error) {
                            return res.status(500).json({
                                               success : false ,
                                               serverErrorMessage : ' there is an server error '
                            })
                        }
                     }


// API for token generate and email send to Admin email
                                        const forgetPassToken = async(req,res)=>{
                                                    
                                            try{
                                            const { email } = req.body;

                                            if (!email || !isValidEmail(email)) {
                                                return res.status(400).json({
                                                            success : false,
                                                            validEmailmessage : "Valid email is required"
                                                })
                                            }

                                            const admin = await Admin.findOne({ email })

                                            if(!admin)
                                            {
                                                return res.status(404).json({ success: false, adminExistanceMessage : ' admin with given email not found'})
                                            }
                                                
                                                let token = await tokenModel.findOne({ adminId : admin._id })
                                                if(!token){
                                                    token = await new tokenModel ({
                                                        adminId : admin._id,
                                                    token : crypto.randomBytes(32).toString("hex")
                                                    }).save()
                                                }

                                                const link = `${process.env.AdminForgetpassURL}`
                                                await Adminforgetpass_sentEmail(admin.email, "Password reset", link)

                                                res.status(200).json({success : true , successMessage  : "password reset link sent to your email account" , token : token})
                                                
                                        }
                                        catch(error)
                                        {
                                                    console.error(error);
                                            res.status(500).json({success : false , serverErrorMessage : "An error occured" , error : error})
                                        }
                                        function isValidEmail(email) {
                                            // email validation
                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                            return emailRegex.test(email);
                                        }
                                        }


               // admin reset password for using token

                                    const reset_password = async (req , res)=>{
                                        try {
                                            const { password , confirmPassword} = req.body
                                            const tokenValue = req.params.tokenValue
                                                
                                            if(!password)
                                            {
                                                return res.status(400).json({
                                                                success : false,
                                                                passwordMessage : 'password  is required'
                                                })
                                            }
                                            if(!confirmPassword )
                                            {
                                                return res.status(400).json({
                                                                success : false,
                                                                confirmPasswordMessage : 'confirmPassword  is required'
                                                })
                                            }

                                            if(password !== confirmPassword)
                                            {
                                                return res.status(400).json({
                                                                    success : false ,
                                                                    passwordMatchMessage : 'password not matched'
                                                })
                                            }

                                                // check if password reset token exist in token model 
                                                const token = await tokenModel.findOne({ token : tokenValue})
                                                if(!token)
                                                {
                                                    return res.status(400).json({
                                                                        success : false,
                                                                        invalidTokenMessage : 'invalid token'
                                                    })
                                                }
                                                    const admin = await Admin.findById(token.adminId)

                                                    if(!admin)
                                                    {
                                                        return res.status(400).json({
                                                                    success : false,
                                                                    InvalidMessage : 'invalid admin '
                                                        })
                                                    }
                                                const hashedPassword = await bcrypt.hash(password , 10)
                                                admin.password = hashedPassword
                                                await admin.save()

                                                await token.deleteOne({ token : tokenValue})
                                                
                                                res.status(200).json({
                                                            success : true ,
                                                            successMessage : 'password reset successfully'
                                                })
                                            
                                        } catch (error) {
                                            return res.status(500).json({
                                                        success : false,
                                                        serverErrorMessage : 'there is an server error'
                                            })
                                        }
                                    }

               // APi to get admin details
                                const getAdmin = async(req,res)=>{
                                    try {
                                        const adminId = req.params.adminId
                                        // check for admin exsitance
                                    const admin = await Admin.findOne({ _id : adminId })
                                    if(!admin)
                                    {
                                        return res.status(400).json({
                                                            success : false ,
                                                            message : ' Admin not found'
                                                        })
                                     }
                                     else
                                     {
                                        return res.status(200).json({ 
                                                       success : true ,
                                                       message : 'Admin details',
                                                       admin_details : [{
                                                                    firstName : admin.firstName,
                                                                    lastName : admin.lastName,
                                                                    email : admin.email,
                                                                    profileImage : admin.profileImage
                                                                    
                                                       }]
                                        })
                                     }

                                    } catch (error) {
                                        return res.status(500).json({
                                                      success : false ,
                                                      message : 'server error'
                                        })
                                    }   
                                }

    // Admin change profileImage
                                            const changeProfile = async (req, res) => {
                                                try {
                                                    const adminId = req.params.AdminId;
                                                    const { firstName , lastName , email} = req.body

                                                    const requiredFields = [
                                                        'firstName' ,
                                                        'lastName' ,
                                                        'email'                    
                                                    ];
                                                     for (const field of requiredFields) {
                                                        if (!req.body[field]) {
                                                            return res.status(400).json({ message: `Missing ${field.replace('_', ' ')} field`, success: false });
                                                        }
                                                    }
                                            
                                                    // Check for admin existence
                                                    const admin = await Admin.findById(adminId);
                                            
                                                    if (!admin) {
                                                        return res.status(400).json({
                                                            success: false,
                                                            message: "Admin not found",
                                                        });
                                                    }
                                                                // Update firstName, lastName, and email
                                                            admin.firstName = firstName
                                                            admin.lastName = lastName
                                                            admin.email = email

                                                    const profile = req.file.filename;
                                            
                                                    // Check if admin already has a profile image
                                                    if (admin.profileImage) {
                                                        // Admin has a profile image, update it
                                                        admin.profileImage = profile;
                                                        await admin.save();
                                            
                                                        return res.status(200).json({
                                                            success: true,
                                                            message: 'Profile image and Information updated successfully',
                                                        });
                                                    } else {
                                                        // Admin does not have a profile image, create it
                                                        admin.profileImage = profile;
                                                        await admin.save();
                                            
                                                        return res.status(200).json({
                                                            success: true,
                                                            message: 'new Profile image created and information updated successfully',
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error(error);
                                                    return res.status(500).json({
                                                        success: false,
                                                        message: "There is a server error",
                                                    });
                                                }
                                            };
                // API for create a demo event
                                                const create_DemoEvent = async (req, res) => {
                                                
                                                        try {
                                                        const adminId = req.params.adminId
                                                        const { title, description, event_Type, venue_Date_and_time } = req.body;
                                                    
                                                        const requiredFields = ['title', 'description', 'event_Type', 'venue_Date_and_time'];
                                                        for (const field of requiredFields) {
                                                            if (!req.body[field]) {
                                                            return res.status(400).json({ message: `Missing ${field.replace('_', ' ')} field`, success: false });
                                                            }
                                                        }
                                                            // check for admin 
                                                            const admin = await Admin.findOne({ _id : adminId })
                                                            if(!admin)
                                                            {
                                                            return res.status(400).json({ success : false , message : `admin not found`})
                                                            }
                                                            
                                                            
                                                         const adminName = admin.firstName

                                                       const demoEvent = await eventModel.findOne({
                                                        adminId,
                                                        title
                                                       })
                                                       if (demoEvent) {
                                                        return res.status(400).json({
                                                            success: false,
                                                            eventExistanceMessage: ' Demo Event already exists with the same adminId and title'
                                                        })
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
                                                            Guests : [],
                                                            co_hosts : [],
                                                            images: imagePaths,
                                                            adminId : adminId,
                                                            event_status :  eventModel.schema.path('event_status').getDefault(),
                                                            adminName : adminName
                                                            
                                                        });
                                                    
                                                        const saveEvent = await newEvent.save();
                                                        res.status(200).json({
                                                            success: true,
                                                            message: 'Demo Event created successfully',
                                                            event_details: saveEvent
                                                        });
                                                        } catch (error) {
                                                            console.error(error);
                                                        return res.status(500).json({
                                                            success: false,
                                                            message: 'There is a server error'
                                                        });
                                                        }
                                                    };
                                                
        // APi for get Demo event by admin Id
                                                const getDemoEvent = async (req ,res)=>{
                                                    try {
                                                    const adminId = req.params.adminId
                                                        // check for event
                                                        const event = await eventModel.find({
                                                            adminId : adminId
                                                        })
                                                        return res.status(200).json({
                                                            success: true,
                                                            message: 'Events fetched successfully',
                                                            events: event,
                                                        });
                                                    } catch (error) {
                                                        return res.status(500).json({
                                                            success : false,
                                                            message: ' there is an server error '
                                                        })
                                                    }
                                                }   
               
                  
// API for get all collections name 
const getAllCollections = async (req, res) => {
    try {
          const eventId = req.params.eventId
        
        // Fetch all collections from the bookmarkModel
        const allCollections = await bookmarkModel.find({ eventId  });

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


  

            // APi for get all guests of a collection  in bookMark model
            const getCollectionGuests = async (req, res) => {
                try {
                    const collectionName = req.body.collectionName;
            
                    // Find the collection by name
                    const collection = await bookmarkModel.findOne({ "bookmark_Collection.name": collectionName });
            
                    if (!collection) {
                        return res.status(400).json({
                            success: false,
                            message: `Collection not found: ${collectionName}`
                        });
                    }
            
                    // Retrieve guests for the found collection
                    const guests = collection.bookmark_Collection[0].bookmark_entries;
            
                    if (!guests || guests.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: `No guests found for the collection: ${collectionName}`
                        });
                    }
            
                    res.status(200).json({
                        success: true,
                        message: `All Guests for the collection: ${collectionName}`,
                        all_guests: guests,
                        collection_entries_count: guests.length
                    });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                        success: false,
                        message: 'There is a server error'
                    });
                }
            };
            



                    
              // API for check and Toggle user event status
                  const checkAndToggleStatus = async (req ,res)=>{
                    try {
                        const eventId = req.params.eventId
                        // check for event existance
                   const event = await eventModel.findOne({ _id : eventId })
                   if(!event)
                   {
                    return res.status(400).json({ success : false , message : 'event not found'})
                   }
                   // toggle the event status

                   const currentStatus = event.event_status
                   const newStatus = 1 - currentStatus
                   event.event_status = newStatus
                      // save the update status in event
                       await event.save()
                      return res.status(200).json({
                                          success : true , 
                                          message : 'Event status changed successfully',
                                          
                      })
                    } catch (error) {
                        return res.status(500).json({
                                    success : false ,
                                    message : ' there is an server error '
                        })
                    }
                  }    
    
        
        // APi for term and condition
        const termAndCondition = async (req, res) => {
            const { Heading, Description } = req.body;
                       
            try {
                // Check if there's an existing term
                const existingTerm = await termAndConditionModel.findOne();
        
                if (existingTerm) {
                    // Update existing term
                    existingTerm.Description = Description;
                    existingTerm.Heading = Heading;
        
                    await existingTerm.save();
        
                    return res.status(200).json({ UpdateMessage: 'Term updated successfully', success: true });
                } else {
                    // Insert new term
                    const newTerm = new termAndConditionModel({
                        Heading: Heading,
                        Description: Description,
                    });
        
                    const savedTerm = await newTerm.save();
        
                    return res.status(200).json({ message: 'Term inserted successfully', id: savedTerm._id });
                }
            } catch (error) {
               
                return res.status(500).json({ success: false, error: 'Server error' });
            }
        };

        // API for get term and Condition
                    const getTermAndCondition = async (req,res) =>{
                        try {
                                const termAndCondition = await termAndConditionModel.find({})
                                if(!termAndCondition)
                                {
                                    return res.status(400).json({ success : false ,
                                                                   ExistanceMessage : 'no term and condition found '})
                                }
                                else
                                {
                                    return res.status(200).json({
                                                        success : true ,
                                                        successMessage : 'term and Conditions',
                                                        details : termAndCondition
                                    })
                                }
                        } catch (error) {
                            return res.status(500).json({
                                                   success : false ,
                                                   serverError : 'server Error'
                            })
                        }
                    }
    
        // API for privacy and policy
                           const privacyAndPolicy = async (req ,res)=>{
                            const { Heading , Description } = req.body
                            try {
                                // check if there is an existing privacy and policy
                           const existingPrivacy_and_policy = await privacyAndPolicyModel.findOne()

                           if(existingPrivacy_and_policy)
                           {
                            existingPrivacy_and_policy.Heading = Heading
                            existingPrivacy_and_policy.Description = Description

                            await existingPrivacy_and_policy.save()

                            return res.status(200).json({
                                                         success : true ,
                                                        UpdateMessage : 'Privacy and Policy updated successfully',
                                                        privacy_and_policy : existingPrivacy_and_policy
                            })
                           }
                           else
                           {
                                const newPrivacy_and_policy = new privacyAndPolicyModel({
                                    Heading : Heading,
                                    Description : Description
                                })

                                  const savedprivacy_and_policy = await newPrivacy_and_policy.save()

                                  return res.status(200).json({
                                                       success : true ,
                                                       createdmessage : 'Privacy and Policy created Successfully',
                                                       privacy_and_policy : savedprivacy_and_policy

                                  })
                           }

                            } catch (error) {
                                return res.status(500).json({
                                                   success : false ,
                                                   serverErrorMessage : 'Server Error'
                                })
                            }
                           }
        
              // API for get privacy and policy
                                 const getPrivacy_and_Policy = async (req ,res) =>{
                                    try {
                                         // check for privacy and policy existance
                                    const privacy_and_policy = await privacyAndPolicyModel.find({ })
                                        if(!privacyAndPolicy)
                                        {
                                            return res.status(400).json({
                                                                 success : false ,
                                                                  privacyExistanceMessage : 'no privacy and policy found '
                                            })
                                        }
                                        else
                                        {
                                            return res.status(200).json({
                                                                success : true ,
                                                                successMessage : 'privacy and policy',
                                                                  Data : privacy_and_policy
                                            })
                                        }
                                        

                                    } catch (error) {
                                        return res.status(500).json({
                                                           success : false ,
                                                           serverErrorMessage : 'server error'
                                        })
                                    }
                                 } 
            // API for get all fedback 
                             const getAllFeedback = async ( req ,res)=> {
                                            try {
                                                // get all feedback
                                        const getAllFeedback = await feedbackModel.find({})
                                        if(!getAllFeedback)
                                        {
                                            return res.status(400).json({
                                                              success : false ,
                                                              feedbackErrorMessage : 'there is no feedback'
                                            })
                                        }

                                        else
                                        {
                                            return res.status(200).json({
                                                               success : true ,
                                                               successMessage : ' all feedback' ,
                                                               Data : getAllFeedback  
                                            })
                                        }
                                            } catch (error) {
                                                return res.status(500).json({
                                                                     success : false ,
                                                                     serverErrorMessage : 'server error'
                                                })
                                            }
                             }

            // API for delete particular feedback
                                      const deleteFeedback = async (req ,res)=>{
                                        try {
                                            const feedbackId = req.params.feedbackId
                                              // check for feedback
                                            const feedback = await feedbackModel.findOneAndDelete({ _id : feedbackId })
                                            if(!feedback)
                                            {
                                                return res.status(400).json({
                                                              success : false ,
                                                              feedbackErrorMessage : 'there is no feedback for given Id'
                                                })
                                            }
                                            else
                                            {
                                                return res.status(200).json({
                                                                success : true,
                                                                successMessage : 'feedback deleted successfully'
                                                })
                                            }
                                        } catch (error) {
                                            return res.status(500).json({
                                                             success : false ,
                                                             serverErrorMessage : 'server error'
                                            })
                                        }
                                      }

        
        // API for get all user
                                const getAllUser = async (req ,res)=>{
                                    try {
                                            // check for users existance
                                    const users = await userModel.find({})
                                    if(!users)
                                    {
                                            return res.status(400).json({
                                                        success : false ,
                                                       userExistanceMessage : 'no Users found'
                                            })
                                    }
                                    else
                                    {
                                        return res.status(200).json({
                                                                 success : true ,
                                                                 successMessage : 'all users',
                                                                 user_details : users   
                                        })
                                    }
                                    } catch (error) {
                                        return res.status(500).json({
                                                      success : false ,

                                        })
                                    }
                                }               
                                
        // API for check and toggle status for user
                               const checkAndToggleStatus_Of_User = async (req ,res )=>{
                                try {
                                        const userId = req.params.userId
                                // check for user
                                   const user = await userModel.findOne({ _id : userId })
                                   if(!user)
                                   {
                                        return res.status(400).json({
                                                   success : false ,
                                                   userExistanceMessage : 'user not found'
                                        })
                                   }

                                   // toggle the User status

                                    const currentStatus = user.user_status
                                    const newStatus = 1 - currentStatus
                                    user.user_status = newStatus

                                    // save the update status in event
                                    await user.save()
                                    return res.status(200).json({
                                                        success : true , 
                                                        message : 'User status changed successfully',                                                        
                                    })
                                } catch (error) {
                                     return res.status(500).json({
                                                       success : false ,
                                                        serverErrorMessage : 'server error'
                                     })
                                }
                               }

          // APi for get Admin notification
          const getAdminNotification = async (req, res) => {
            try {
              const adminId = req.params.adminId;
          
              // check for admin
              const admin = await Admin.findOne({ _id: adminId });
          
              if (!admin) {
                return res.status(404).json({
                  success: false,
                  adminExistanceMessage: 'Admin not found with the given Id',
                });
              }
          
              // check for notification
              const notifications = await AdminNotificationDetail.find({ }); 
          
              if (notifications.length === 0) {
                return res.status(404).json({
                  success: false,
                  notificationExistMessage: 'No notifications for this Admin',
                });
              } else {
                const sortedNotifications = notifications.sort((a, b) => b.createdAt - a.createdAt);
                return res.status(200).json({
                  success: true,
                  successMessage: 'Admin notifications',
                  notification_Details: sortedNotifications,
                });
              }
            } catch (error) {
              console.error('Error:', error);
              return res.status(500).json({
                success: false,
                serverErrorMessage: 'Server Error',
              });
            }
          };
// API to send Notification to all user
                                const sendNotification_to_allUser = async (req, res) => {
                                    try {
                                    const { title, message , event_location} = req.body;
                                
                                    const requiredFields = ['title', 'message','event_location'];
                                
                                    for (const field of requiredFields) {
                                        if (!req.body[field]) {
                                        return res.status(400).json({
                                            success: false,
                                            message: `Missing ${field.replace('_', ' ')} field `,
                                        });
                                        }
                                    }
                                
                                    // Get all users
                                    const users = await userModel.find({});
                                
                                    if (users.length === 0) {
                                        return res.status(400).json({
                                        success: false,
                                        message: 'There is no user in UserModel',
                                        });
                                    }
                                
                                    // Send the same notification email to all users
                                    const notifications = await Promise.all(users.map(async (user) => {
                                        // Prepare email content
                                        let messageContent = `
                                        Dear ${user.fullName}, 
                                        *************************************************************** 
                                        ${title} 
                                        ---------
                                        ${message}
                                        ****************************************************************
                                        `;
                                
                                        // Send email notification to the user
                                        await notificationEmail(user.email, 'Notification', messageContent);
                                
                                        // Add user-specific data to the notifications array
                                    return {
                                        userId: user._id,
                                        title,
                                        message,
                                        event_location,
                                        userEmail: user.email,
                                        status : 1
                                        }
                                    }))
                                
                                    // Save a single record in UsersNotificationModel
                                    const savedNotification = await UsersNotificationModel.create({
                                        title,
                                        message,
                                        date : new Date(),
                                        event_image: "0",
                                        event_location: event_location
                                    });
                                
                                    return res.status(200).json({
                                        success: true,
                                        message: 'Notifications sent to user email',
                                        notification_details: savedNotification,
                                    });
                                    } catch (error) {
                                    console.error(error);
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Server error',
                                    });
                                    }
                                };
  // Api to send notification to particular user
                                        const sendNotification_to_user = async (req, res) => {
                                            try {
                                                const { userId, title, message , event_location } = req.body;

                                                // Validate input fields
                                                const requiredFields = [ 'title', 'message','event_location'];

                                                for (const field of requiredFields) {
                                                    if (!req.body[field]) {
                                                        return res.status(400).json({
                                                            success: false,
                                                            message: `Missing ${field.replace('_', ' ')} field`,
                                                        });
                                                    }
                                                }
                                                if(!userId)
                                                {
                                                  return res.status(400).json({
                                                                 success : false ,
                                                                 userValidationMessage : 'select user for send notification'
                                                  })
                                                }

                                                // Get the user by userId
                                                const user = await userModel.findOne({ _id : userId } );
                                                        const userName = user.fullName
                                                if (!user) {
                                                    return res.status(404).json({
                                                        success: false,
                                                        message: 'User not found',
                                                    });
                                                }

                                                // Prepare email content
                                                const messageContent = `
                                                    Dear ${user.fullName}, 
                                                    *************************************************************** 
                                                    ${title} 
                                                    ---------
                                                    ${message}
                                                    ****************************************************************
                                                `;

                                                // Send email notification to the user
                                                await notificationEmail(user.email, 'Notification', messageContent);

                                                // Save a single record in UsersNotificationModel
                                                const savedNotification = await UsersNotificationModel.create({
                                                    userId: user._id,
                                                    title,
                                                    message,
                                                    date: new Date(),
                                                    userName : userName,
                                                    event_image: "0",
                                                    event_location: event_location,
                                                    status : 1

                                            
                                                });

                                                return res.status(200).json({
                                                    success: true,
                                                    message: 'Notification sent to user email',
                                                    notification_details: savedNotification,
                                                });
                                            } catch (error) {
                                                console.error(error);
                                                return res.status(500).json({
                                                    success: false,
                                                    message: 'Server error',
                                                });
                                            }
                                        };
  // API to send notification to all user and particular one according to admin choice

                                        const sendNotifications = async (req, res) => {
                                            try {
                                              const adminChoice = req.body.adminChoice;
                                          
                                              let notificationFunction;
                                          
                                              if (adminChoice === 1) {
                                                notificationFunction = sendNotification_to_user;
                                              } else if (adminChoice === 2) {
                                                notificationFunction = sendNotification_to_allUser;
                                              } else {
                                                return res.status(400).json({
                                                  success: false,
                                                  InvalidChoiceMessage: " Please select one option",
                                                });
                                              }
                                          
                                              // Call the selected notification function
                                              await notificationFunction(req, res);
                                          
                                              // Only send the success response if the notification function didn't send a response
                                              if (!res.headersSent) {
                                                return res.status(200).json({
                                                  success: true,
                                                  NotificationSentMessage: 'Notification sent',
                                                });
                                              }
                                            } catch (error) {
                                             
                                              if (!res.headersSent) {
                                                return res.status(500).json({
                                                  success: false,
                                                  serverErrorMessage: 'Server error',
                                                });
                                              }
                                            }
                                          };
// API for get all notification details
                                            const getAll_Users_Notificatation = async (req, res) => {
                                                try {
                                                const { title , userId} = req.query;
                                                const filter = {};
                                            
                                                if (title) {
                                                    filter.title = title;
                                                }          
                                                if(userId)
                                                {
                                                    filter.userId = userId
                                                }
                                            
                                                const notifications = await UsersNotificationModel.find(filter);
                                            
                                                if (notifications.length === 0) {
                                                    return res.status(400).json({
                                                    success: false,
                                                    message: 'No notifications for the user',
                                                    });
                                                }
                                            
                                                const allNotifications = notifications.map((notification) => ({
                                                    ...notification.toObject(),
                                                    send_to: notification.userId ? `${notification.userName}` : 'allUser',
                                                }));
                                            
                                                const response = {
                                                    success: true,
                                                    message: 'User Notifications',
                                                    notifications: allNotifications,
                                                };
                                                const sortedNotifications = allNotifications.sort((a, b) => b.createdAt - a.createdAt);
                                                return res.status(200).json(response);
                                                } catch (error) {
                                                    console.error(error);
                                                return res.status(500).json({
                                                    success: false,
                                                    message: 'Server error',
                                                });
                                                }
                                            };

// API for delete notification by Id
                                        const deleteNotifcationById = async(req ,res)=>{
                                            try {
                                                const notificationId = req.params.notificationId
                                                // check for notification
                                            
                                                const notification = await UsersNotificationModel.findByIdAndDelete({
                                                                _id : notificationId
                                                })
                                                if(!notification)
                                                {
                                                return res.status(400).json({
                                                                    success : false ,
                                                                    message : 'no notifcation found with the given Id'
                                                })
                                                }
                                                else
                                                {
                                                return res.status(200).json({
                                                                    success : true ,
                                                                    message : 'notification deleted successfully'
                                                })
                                                }
                                                } catch (error) {
                                            return res.status(500).json({
                                                        success : false ,
                                                        message : 'server error'
                                            })
                                            }
                                        }

// API for get contact Us details 
                                    const getContactUs_Details = async (req ,res)=>{
                                        try {
                                              // check for contect us page details existance
                                      const getContactUs_Detail = await contactUs.find({ })
                                      if(!getContactUs_Detail)
                                      {
                                        return res.status(400).json({
                                                         success : false ,
                                                         contactUsErrorMessage : 'no contact Data found'
                                        })
                                      }
                                      else
                                      {
                                        return res.status(200).json({
                                                         success : true ,
                                                         successMessage : 'contact us Page details',
                                                         ContactUsPage_Detail : getContactUs_Detail
                                        })
                                      }
                                        } catch (error) {
                                            return res.status(500).json({
                                                                 success : false ,
                                                                 serverErrorMessage : 'server Error'
                                            })
                                        }
                                    }

// Api for delete contact us details by id
                                     const deleteContactDetails = async (req , res)=>{
                                        try {
                                               const contactDetailId = req.params.contactDetailId
                                        // check and delete contact details
                                        const contactDetail = await contactUs.findOneAndDelete({ _id : contactDetailId})
                                            if(!contactDetail)
                                            {
                                                return res.status(400).json({
                                                                success : false ,
                                                                contactUsErrorMessage : 'no contact details found'
                                                })
                                            }
                                            else
                                            {
                                                return res.status(200).json({
                                                                     success : true ,
                                                                     successMessage : 'contact detail deleted successfully ..!'
                                                })
                                            }
                                        } catch (error) {
                                            return res.status(500).json({
                                                            success : false , 
                                                            successMessage : 'server Error'
                                            })
                                        }
                                     }

// API for get FAQ Details of users
                                   const getFAQ = async(req , res)=>{
                                    try {
                                        // check for FAQ Details existance
                                    const getFAQ_Details = await faqModel.find({ })
                                    if(!getFAQ_Details)
                                    {
                                        return res.status(400).json({
                                                          success : false ,
                                                          ExistanceMessage : 'no FAQ Details found'
                                        })
                                    }
                                    else
                                    {
                                        return res.status(200).json({
                                                          success : true ,
                                                          successMessage : 'USER FAQ DETAILS' ,
                                                          FAQ_Details : getFAQ_Details
                                        })
                                    }
                                    } catch (error) {
                                        return res.status(500).json({
                                                        success : false ,
                                                        serverError : 'server error'
                                        })
                                    }
                                   }
          
                                   
                            // API for get particular bookmark collection details
                            const getCollectionById = async (req, res) => {
                                try {
                                const collectionId = req.params.collectionId;
                            
                                // Validate collectionId as a required field
                                if (!collectionId) {
                                    return res.status(400).json({
                                    success: false,
                                    message: 'collectionId is a required field',
                                    });
                                }
                            
                                // Fetch the collection by ID from the bookmarkModel
                                const collection = await bookmarkModel.findOne({
                                    _id: collectionId,
                                });
                            
                                // Check if the collection exists
                                if (!collection || collection.bookmark_Collection.length === 0) {
                                    return res.status(400).json({
                                    success: false,
                                    existanceMessage: 'No collection found with the provided ID',
                                    });
                                }
                            
                                // Access the 'bookmark_Collection' directly without using reduce
                                const bookmarkCollection = collection.bookmark_Collection;
                            
                                res.status(200).json({
                                    success: true,
                                    successMessage: 'Collection details retrieved successfully',
                                    collectionName : bookmarkCollection[0].name ,
                                     collectionGuests : bookmarkCollection[0].bookmark_entries
                                    // bookmark_Collection: bookmarkCollection,

                                });
                                } catch (error) {
                                console.error(error);
                                return res.status(500).json({
                                    success: false,
                                    serverError: 'Server error',
                                });
                                }
                            };
                            
      // Api for get all Details of DashBorad
                   const all_Details = async ( req ,res)=>{
                    try {
                            // check for all users 
                    const users = await userModel.find({ })
                        if(!users)
                        {
                            return res.status(400).json({
                                     success : false ,
                                     users_message : 'users details not found'
                            })
                        } 
                        // check for all Events
                    const events = await eventModel.find({ })
                    if(!events)
                    {
                        return res.status(400).json({
                              success : false ,
                              event_message : 'event details not found'
                        })
                    }

                      // check for feedbacks

                         const allFeedbacks = await feedbackModel.find({ })
                         if(!allFeedbacks)
                         {
                            return res.status({
                                 success : false ,
                                 feedback_message : 'feedback details not found'
                            })
                         }

                        return res.status(200).json({
                               success : true ,
                               message : 'all Details count',
                               user_count : users.length,
                               event_count : events.length,
                               feedback_count : allFeedbacks.length

                        })
                            
                    } catch (error) {
                        return res.status(500).json({
                                   success : false ,
                                   serverErrorMessage : 'server error',
                                    error_message : error.message
                        })
                    }
                   }                     
                                   


                                 
   

        module.exports = { login_Admin  , changePassword , forgetPassToken , reset_password ,
                               changeProfile ,create_DemoEvent, getCollectionGuests , 
                                getAdmin , getDemoEvent , checkAndToggleStatus , termAndCondition ,
                                getTermAndCondition , privacyAndPolicy , 
                                getPrivacy_and_Policy , getAllFeedback , deleteFeedback , getAllUser ,
                                checkAndToggleStatus_Of_User  , getAdminNotification , sendNotification_to_allUser,
                                sendNotification_to_user , sendNotifications , getAll_Users_Notificatation , 
                                deleteNotifcationById , getContactUs_Details , deleteContactDetails , getFAQ , getAllCollections ,
                                getCollectionById , all_Details
                            }