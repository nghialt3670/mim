const ImageModel = require('../models/ImageModel');
const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');
const LikeModel = require('../models/LikeModel')


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

  handleEditCaption: async (req, res) => {
    try {
      const { postId, newCaption }= req.body;

      await PostModel.findByIdAndUpdate(
        postId,
        { $set: { caption: newCaption } },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }
  },

  handleDeletePost: async (req, res) => {
    try {
      const { postId } = req.body;

      // Find the post to get associated data
      const deletedPost = await PostModel.findById(postId); 

      // Remove the post ID from the User's ownPosts array
      await UserModel.updateOne({ _id: deletedPost.author }, { $pull: { ownPosts: postId } });

      // Remove the post ID from the likedPosts array of all users who liked the post
      await UserModel.updateMany({ _id: { $in: deletedPost.likes } }, { $pull: { likedPosts: postId } });

      // Remove the post's ID from the associated Image record (if it exists)
      if (deletedPost.image) {
        await ImageModel.findByIdAndDelete(deletedPost.image);
      }

      // Remove likes associated with the post
      await LikeModel.deleteMany({ _id: { $in: deletedPost.likes } });

      // Delete the post
      await PostModel.findByIdAndDelete(postId);

      res.status(200).send('Post deleted successfully');
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }
  },

  handleUpdateAvatar: async (req, res) => {
    try {
      const userId = req.session.userId;

      // Create a new avatar in the Image collection
      const newAvatar = new ImageModel({
        data: req.file.buffer,
        contentType: req.file.mimetype,
        type: "user-avatar"
      });

      const savedAvatar = await newAvatar.save();

      // Update the user's avatar reference in the User collection
      await UserModel.findByIdAndUpdate(userId, { avatar: savedAvatar._id });

      res.status(200).json({ success: true, message: 'Avatar updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = PostController