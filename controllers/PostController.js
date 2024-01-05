const ImageModel = require('../models/ImageModel');
const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');
const LikeModel = require('../models/LikeModel')
const helper = require('../helper')


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
  },

  handleLoadNewsfeed: async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await UserModel.findById(userId).populate('avatar');
      const offset = req.query.offset || 0;
      const limit = 5; // Set the number of posts to load each time
      const posts = await PostModel.find({})
        .populate({ path: 'author', select: 'username avatar', populate: { path: 'avatar' } })
        .populate('image')
        .sort({ timeCreate: -1 })
        .skip(offset)
        .limit(limit)
        .exec();

      const postDtos = posts.map(post => ({
        // Map post model data to post dto
        id: post._id,
        timeCreate: post.timeCreate,
        author: post.author.username,
        avatar: post.author.avatar,
        caption: post.caption,
        image: post.image,
        numLikes: post.likes.length,
        // Check if the post is liked by the user
        liked: user.likedPosts.findIndex(likedPost => (likedPost._id.equals(post._id))) !== -1 ? true : false
      }));
      res.json({ user: user, posts: postDtos, helper: helper});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  handleLoadLikedPosts: async (req, res) => {
    try {
      const offset = req.query.offset || 0;
      const limit = 5; // Set the number of posts to load each time

      const userId = req.session.userId;
      const user = await UserModel.findById(userId)
        .populate('avatar')
        .populate({
          path: 'likedPosts',
          select: 'author image likes timeCreate caption',
          populate: [
            { path: 'author', select: 'username avatar', populate: { path: 'avatar' } },
            { path: 'image' },
            { path: 'likes', populate: { path: 'user' } },
          ]
        })
        .exec();

      // Reverse the likedPosts array
      let likedPosts = user.likedPosts.reverse();

      // Apply offset and limit to get the desired subset of posts
      likedPosts = likedPosts.slice(offset, offset + limit);

      // Map post model data to post dto 
      const postDtos = likedPosts.map(post => ({ 
        id: post._id,
        timeCreate: post.timeCreate,
        author: post.author.username,
        avatar: post.author.avatar,
        caption: post.caption,
        image: post.image,
        numLikes: post.likes.length,
        liked: user.likedPosts.findIndex(likedPost => (likedPost._id.equals(post._id))) !== -1 ? true : false
      }));


      res.setHeader('Cache-Control', 'no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.json({ user: user, posts: postDtos, helper: helper });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } 
  }
}

module.exports = PostController;