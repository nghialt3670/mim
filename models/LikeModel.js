const mongoose = require('mongoose');

const likeSChema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	timeCreate: { type: Date, default: Date.now }
});
  
const LikeModel = mongoose.model('Like', likeSChema);

module.exports = LikeModel