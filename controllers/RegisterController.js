const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');


const RegisterController = {
  // Handle user registration
  handleRegister: async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log(password)

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the username already exists
      const user = await UserModel.findOne({ username });
      
      if (user) {
        // Username already exists, set session flag and redirect to registration page
        req.session.username_already_exists = true;
        res.redirect('/register');
      } else {
        // Create a new user with hashed password and save to the database
        const newUser = new UserModel({
          username: username,
          password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();
        
        // Redirect to login page after successful registration
        res.redirect('/login');
      }      
    } catch (error) {
      console.error(error);
      // Handle internal server error
      res.status(500).send('Internal Server Error');
    }
  },
}

module.exports = RegisterController