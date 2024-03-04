const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://mobappssolutions181:root123@cluster0.ro8e4sn.mongodb.net/festa_bash', {
  // mongoose.connect('mongodb://127.0.0.1:27017/festa_bash', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
})

module.exports = db