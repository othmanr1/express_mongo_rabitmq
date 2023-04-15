const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    roleCode : String,    
    roleDesc : String  ,
    createdOn: {
        type: Date,
        default: Date.now
    }  
});

module.exports = mongoose.model('Role',RoleSchema);