const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	timeCreate: { type: Date, default: Date.now },
	caption: { type: String },
	image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
