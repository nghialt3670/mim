const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	data: Buffer,
	contentType: String,
	type: String
});
  
const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel