const express = require('express');
const router = express.Router();
const multer = require('multer');
const LoginController = require('../controllers/LoginController');
const RegisterController = require('../controllers/RegisterController');
const PostController = require('../controllers/PostController');
const HomeController = require('../controllers/HomeController');
const LikeController = require('../controllers/LikeController');
const ProfileController = require('../controllers/ProfileController');

// Multer setup
const storage = multer.memoryStorage(); // Store the file in memory as Buffer
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  if (req.session.userId) {
    HomeController.handleHomePage(req, res);
    return;
  }

  res.render('index');
});

router.get('/register', (req, res) => { 
  const username_already_exists = req.session.username_already_exists;
  req.session.username_already_exists = undefined;
  res.render('register', { username_already_exists });
});

router.get('/login', (req, res) => {
  const username_not_found = req.session.username_not_found;
  const wrong_password = req.session.wrong_password;
  req.session.username_not_found = undefined;
  req.session.wrong_password = undefined;
  res.render('login', { username_not_found, wrong_password});
});

router.get('/post-upload', (req, res) => {
  if (req.session.userId) {
    res.render('upload');
    return
  }
  res.redirect('/');
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

router.get('/profile/:username?', (req, res) => {
  if (req.session.userId) {
    ProfileController.handleLoadProfile(req, res);
    return;
  }
  res.redirect('/')
});

router.get('/liked-post', (req, res) => {
  if (req.session.userId) {
    HomeController.handleLoadLikedPost(req, res);
    return;
  }
  res.redirect('/')
});

router.get('/api/posts', PostController.handleLoadNewsfeed)

router.post('/register', RegisterController.handleRegister);

router.post('/login', LoginController.handleLogin);

router.post('/post-upload', upload.single('image'), PostController.handlePostUpload);

router.post('/update-like', LikeController.handleUpdateLike);

router.post('/edit-caption', PostController.handleEditCaption);

router.post('/delete-post', PostController.handleDeletePost);

router.post('/update-avatar', upload.single('avatar'), PostController.handleUpdateAvatar);


module.exports = router;

