const UserModel = require('../models/UserModel');
const ImageModel = require('../models/ImageModel')
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');


const RegisterController = {
  // Handle user registration
  handleRegister: async (req, res) => {
    try {
      // Get username and password from request
      const { username, password } = req.body;

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

        let defaultAvatar = await ImageModel.findOne({ type: 'default-avatar'});

        if (!defaultAvatar) {
          // Read the default avatar image file and convert it into a Buffer
          const defaultAvatarPath = path.join(process.cwd(), 'public/images/default_avatar.webp');
          const defaultAvatarBuffer = fs.readFileSync(defaultAvatarPath);
          // Create a new instance of ImageModel with the image data and content type
          defaultAvatar = new ImageModel({
            data: defaultAvatarBuffer,
            contentType: 'image/webp',
            type: 'default-avatar'
          });

          // Save the new image instance to the database
          await defaultAvatar.save();
        }
        
        // Set the default avatar for the user
        newUser.avatar = defaultAvatar._id;

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