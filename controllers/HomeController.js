const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');


const HomeController = {
	handleHomePage: async (req, res) => {
    try {
      const username = req.session.username;
      const user = await UserModel.findOne({ username }).populate('avatar');

      // Find all current posts and sort according to likes
      const posts = await PostModel.find({})
        .populate({path: 'author', select: 'username avatar', populate: { path: 'avatar' }})
        .populate('image');

      posts.sort((post1, post2) => (post1.likes.length - post2.likes.length)); 

      // Map post model data to post dto 
      const postDtos = posts.map(post => ({
        id: post._id,
        author: post.author.username,
        avatar: post.author.avatar,
        caption: post.caption,
        image: post.image,
        numLikes: post.likes.length,
        numComments: post.comments.length
      }));

		  res.render('home', { user: user, posts: postDtos });
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }  
	}
};

module.exports = HomeController;
