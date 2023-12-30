const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const MONGODB_CONNECT_URI = ""

// Creating an instance of the Express application.
const app = express();

// Defining the port number for the server to listen on.
const PORT = 3000;

// Connecting to the MongoDB database named 'mim'.
mongoose.connect(process.env.MONGODB_CONNECT_URI);

// Middleware to parse JSON
app.use(express.json());

// Configuring middleware to parse incoming URL-encoded data and populate the req.body object.
app.use(bodyParser.urlencoded({ extended: true }));

// Configuring session middleware for Express.
app.use(session({ secret: 'mimapp', resave: false, saveUninitialized: true }));

// Setting the view engine to 'ejs' and specifying the views directory.
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Using the 'index' route module for handling requests at the root path.
app.use('/', require('./routes/index'));

// Starting the Express server and listening on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Serving static files (e.g., CSS, images) from the 'public' directory.
app.use(express.static('public'));
