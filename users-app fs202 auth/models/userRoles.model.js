const mongoose = require('mongoose');

const UserRolesSchema = mongoose.Schema({
    roleId : { type : mongoose.SchemaTypes.ObjectId, ref: 'User'},    
    UserId : { type : mongoose.SchemaTypes.ObjectId, ref: 'Role'},
    createdOn: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('UserRoles',UserRolesSchema);