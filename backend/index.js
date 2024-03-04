const express = require('express')  
const app = express()
require('dotenv').config()
const port = process.env.PORT || 6001;

const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoute')
const cors = require('cors')
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')

//database configuration
const db = require('./config/db')

//middleware

app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.use(cors())
app.use(express.static('uploads'))



//Router Configuration
app.use('/api', userRoutes );
app.use('/api', adminRoutes );


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:6002/api/'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  