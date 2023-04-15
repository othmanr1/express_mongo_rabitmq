const mongoose = require('mongoose');

const MsgSchema = mongoose.Schema({
     
    msgDesc : String  ,
    createdOn: {
        type: Date,
        default: Date.now
    }  
});

module.exports = mongoose.model('Msg',MsgSchema);