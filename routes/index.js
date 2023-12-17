const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');
const RegisterController = require('../controllers/RegisterController');

router.get('/', (req, res) => {
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

router.post('/register', RegisterController.handleRegister);

router.post('/login', LoginController.handleLogin);


module.exports = router;

