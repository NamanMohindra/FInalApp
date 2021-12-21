const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const connectionString = 'mongodb+srv://Naman:naman1@cluster0.w8and.mongodb.net/hw7?retryWrites=true&w=majority';
const connection =   mongoose.createConnection(connectionString);
const AutoIncrement = AutoIncrementFactory(connection);

const profileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [false],
        default: '',
    },
    following: {
        type: Array,
        required: [false],
        default: [],
    },
    zipcode: {
        type: String,
        required: [false],
        default: '',
    },
    dob: {
        type: String,
        required: [false],
        default: '',
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    headline: {
        type: String,
        required: [true, 'Headline is required']
    },
    avatar: {
        type: String,
        required: [false],
        default: '',
    },
    phone:{
        type: Number,
        required: [false]
    },
    gid: {
        type: String,
        required: [false],
        default: '',
    },
    
})
profileSchema.plugin(AutoIncrement, {inc_field: 'userId'});
module.exports = profileSchema;