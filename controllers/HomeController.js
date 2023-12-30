const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');
const helper = require('../helper')


const HomeController = {
	handleHomePage: async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await UserModel.findById(userId).populate('avatar');

      // Find all current posts and sort according to timeCreated
      const posts = await PostModel.find({})
        .populate({ path: 'author', select: 'username avatar', populate: { path: 'avatar' } })
        .populate('image')
        .sort({ timeCreate: -1 })
        .exec();

      // Map post model data to post dto 
      const postDtos = posts.map(post => ({
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

		  res.render('home', { user: user, posts: postDtos, helper: helper });
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }  
	},

  handleLoadLikedPost: async (req, res) => {
    const userId = req.session.userId;
    const user = await UserModel.findById(userId).populate('avatar')
    .populate({ 
      path: 'likedPosts', 
      select: 'author image likes timeCreate', 
      populate: [
        { path: 'author', select: 'username avatar', populate: { path: 'avatar' } },
        { path: 'image'},
        { path: 'likes', populate: { path: 'user' } }
      ]})
      .exec();

    const likedPosts = user.likedPosts.reverse()

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

    res.render('home', { user: user, posts: postDtos, helper: helper });
  }
};

module.exports = HomeController;
