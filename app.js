const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require('mongoose');
const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qx7so.mongodb.net/api_blog?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const User = require('./models/user');

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

// https://www.youtube.com/watch?v=7nafaH9SddU&ab_channel=TraversyMedia
// app.post('/api/posts', verifyToken, (req, res) => {
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: 'Post created...',
//         authData
//       });
//     }
//   });
// });

app.post('/api/login', (req, res) => {
  //mock user
  const user = {
    id: 1,
    user: 'brad',
    email: 'brad@gmail.com'
  };

  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({
      token
    });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// verify token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== undefined) {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.post('/api/login', (req, res) => {
  //mock user
  const user = {
    id: 1,
    user: 'brad',
    email: 'brad@gmail.com'
  };

  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({
      token
    });
  });
});

let dogsArr = [];
app.post('/api/posts', function (req, res) {
  const post = req.body;
  const { title, body } = post;
  console.log(`title: ${title} body: ${body}`);
  res.send(`title: ${title} body: ${body}`);
});

app.listen(5000, () => console.log('Server started on port 5000'));
