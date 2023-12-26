const UserModel = require('../models/UserModel')

const ProfileController = {
  handleLoadProfile: async (req, res) => {
    const username = req.params.username;

    const user = await UserModel.findById(req.session.userId);
    const likedPosts = user.likedPosts;

    const profileUser = await UserModel.findOne({ username: username })
      .populate('avatar')
      .populate({ path: 'ownPosts', populate: [
        {path: 'author', select: 'username avatar', populate: { path: 'avatar' }},
        {path: 'image'}
      ]}); 

    const postDtos = profileUser.ownPosts
      .sort((a, b) => (new Date(b.timeCreate) - new Date(a.timeCreate)))  
      .map(post => ({ 
        id: post._id, 
        author: post.author.username,
        avatar: post.author.avatar,
        caption: post.caption,
        image: post.image,
        numLikes: post.likes.length,
        liked: likedPosts.findIndex(likedPost => (likedPost._id.equals(post._id))) !== -1 ? true : false
      }));

    const profile = { 
      username: username,
      avatar: profileUser.avatar, 
      posts: postDtos,
    }

    res.render('profile', { user: user, profile: profile });
  }
} 

module.exports = ProfileController