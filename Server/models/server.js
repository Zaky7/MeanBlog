const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const serverSchema = new Schema({
     name: {
       type: String,
       required: true
     },
     capacity:{
       type: Number,
       required: true
     },
     id: {
       type: Number
     }  
});


mongoose.model('server', serverSchema);