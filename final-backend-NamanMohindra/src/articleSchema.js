var mongoose = require('mongoose')

const AutoIncrementFactory = require('mongoose-sequence');

const connectionString = 'mongodb+srv://Naman:naman1@cluster0.w8and.mongodb.net/hw7?retryWrites=true&w=majority';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const connection =   mongoose.createConnection(connectionString);
const AutoIncrement = AutoIncrementFactory(connection);


var articleSchema = new mongoose.Schema({
  author: {
    type: String,
    required:[true,'Author is required']
  },
  date: {
    type: Date,
    required: [true]
},
  text:{
    type: String,
    required:[true, 'Text is required']
  },
  comments: {
    type: Array, 
    required: [false],
    default: []
  }, 
  img: {
    type: String,
    required: [false],
    default: '',
}, 
})

articleSchema.plugin(AutoIncrement, {inc_field: 'articleId'});
module.exports = articleSchema;


