const LikeModel = require('../models/LikeModel');
const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel')

const LikeController = {
  handleLike: async (req, res) => {
    const userId = req.session.userId;
    const { postId } = req.body;
    
    const existingLike = await LikeModel.findOne({ user: userId, post: postId });

    if (existingLike) {
      // If the like exists, remove it
      await LikeModel.findOneAndDelete({ user: userId, post: postId });

      // Remove like reference from the Post model
      await PostModel.findByIdAndUpdate(postId, { $pull: { likes: existingLike._id } });

      // Remove post reference from the User model
      await UserModel.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });

    } else {
      // If the like doesn't exist, add a new like
      const newLike = new LikeModel({
        user: userId,
        post: postId,
      });
      await newLike.save(); 

      // Add like reference to the Post model
      await PostModel.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });

      // Add post reference to the User model
      await UserModel.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
    }
  }
} 

module.exports = LikeController