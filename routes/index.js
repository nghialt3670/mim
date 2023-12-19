const express = require('express');
const router = express.Router();
const multer = require('multer');
const LoginController = require('../controllers/LoginController');
const RegisterController = require('../controllers/RegisterController');
const PostController = require('../controllers/PostController');
const HomeController = require('../controllers/HomeController')

// Multer setup
const storage = multer.memoryStorage(); // Store the file in memory as Buffer
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  if (req.session.username) {
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
  if (req.session.username) {
    res.render('upload');
    return
  }
  res.redirect('/');
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

router.post('/register', RegisterController.handleRegister);

router.post('/login', LoginController.handleLogin);

router.post('/post-upload', upload.single('image'), PostController.handlePostUpload)


module.exports = router;

