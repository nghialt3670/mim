const ImageModel = require('../models/ImageModel');
const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');


const PostController = {
  // Handle user posting 
  handlePostUpload: async (req, res) => {
    try {
      // Get values from request
      const { caption, timeCreate } = req.body;
      const { buffer, mimetype } = req.file;

      const user = await UserModel.findById(req.session.userId);
      
      // Create and save the image
      const image = new ImageModel({
        data: buffer,
        contentType: mimetype,
        type: 'post-image'
      });

      const savedImage = await image.save();

      // Create and save the post with the image
      const post = new PostModel({
        author: user._id,
        timeCreate: timeCreate,
        caption: caption,
        image: savedImage._id,
      });

      const savedPost = await post.save();

      // Update user's posts
      user.ownPosts.push(savedPost._id);
      await user.save();

      // Redirect to home page
      res.redirect('/');
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }
  },
}

module.exports = PostController