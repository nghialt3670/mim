const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_CONNECT_URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'mimapp', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static('public'));
