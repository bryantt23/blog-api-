const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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
const Post = require('./models/post');
const Comment = require('./models/comment');

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

// add a new post
app.post('/api/posts', async function (req, res) {
  const post = req.body;
  const { title, body } = post;
  console.log(`title: ${title} body: ${body}`);
  res.send(`title: ${title} body: ${body}`);
  //get the user
  //TODO verify it's the user i.e. user verifyToken function
  const user = await User.findOne({ username: 'bt23' }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { msg: 'Incorrect username' });
    }
    // bcrypt.compare(password, user.password, (err, res) => {
    //   if (res) {
    //     // passwords match! log user in
    //     return done(null, user);
    //   } else {
    //     // passwords do not match!
    //     return done(null, false, { msg: 'Incorrect password' });
    //   }
    // });
  });
  console.log(user.username);

  //create a post
  const newPost = await new Post({ ...post });

  newPost.save(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    // saved!
    //add the post to the user's posts
    user.posts.push(newPost);

    user.save(function (err) {
      console.log(err);
      if (err) return;
      // saved!
    });
  });
});

// get all posts including comments and return as json
app.get('/api/posts', function (req, res) {
  Post.find({})
    .populate('comments')
    .exec(function (err, posts) {
      var postMap = {};

      posts.forEach(function (post) {
        postMap[post._id] = post;
      });

      res.send(postMap);
    });
});

// add a new comment to a post
app.post('/api/posts/:id', async function (req, res) {
  const postId = req.params.id;
  const comment = req.body;
  const { commenter, body } = comment;
  let message;
  await Post.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
      message = err;
      res.json({ message });
    }
    const newComment = new Comment({ commenter: commenter, body: body });

    newComment.save(function (err) {
      if (err) {
        message = err;
        console.log(err);
        res.json({ message });
      }
      post.comments.push(newComment);
      post.save(function (err) {
        if (err) {
          console.log(err);
          message = err;
          res.json({ message });
        }
        message = 'Comment has been added';
        res.status(201).json({ message });
      });
    });
  });
});

app.listen(5000, () => console.log('Server started on port 5000'));
