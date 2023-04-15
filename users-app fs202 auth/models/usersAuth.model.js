const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "fullname not provided "],
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email not provided"],
    validate: {
      validator: function (mail) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  role: [{ type : mongoose.SchemaTypes.ObjectId, ref: 'Role'}],
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("user", userSchema);