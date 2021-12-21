const mongoose = require('mongoose');

const AutoIncrementFactory = require('mongoose-sequence');

const connectionString = 'mongodb+srv://Naman:naman1@cluster0.w8and.mongodb.net/hw7?retryWrites=true&w=majority';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const connection =   mongoose.createConnection(connectionString);
const AutoIncrement = AutoIncrementFactory(connection);

var userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,'username is required']
  },
  salt:{
    type: String,
    required: [true, 'salt is required']
  },
  hash:{
    type:String,
    required: [true, 'hash is required']
  },
})

userSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = userSchema;
