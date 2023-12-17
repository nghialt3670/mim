const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timeCreate: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
