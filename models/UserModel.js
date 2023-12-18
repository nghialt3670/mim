const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timeCreate: { type: Date, default: Date.now },
  avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  ownPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
