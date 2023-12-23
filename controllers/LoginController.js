const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

const LoginController = {
  // Handle user login
  handleLogin: async (req, res) => {
    try {
      // Get username and password from resquest
      const { username, password } = req.body;

      // Find the user in the database based on the requested username
      const user = await UserModel.findOne({ username });

      if (!user) {
        // Username not found, set session flag and redirect to login page
        req.session.username_not_found = true;
        res.redirect('/login');
      } else if (!await bcrypt.compare(password, user.password)) {
        // Incorrect password, set session flag and redirect to login page
        req.session.wrong_password = true;
        res.redirect('/login');
      } else {
        // Login successful, set user session and redirect to home page
        req.session.userId = user._id;
        res.redirect('/');
      }
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }
  },
}

module.exports = LoginController