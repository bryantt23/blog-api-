var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {
    type: String,
    required: true,
    maxlength: 100
  },
  commenter: {
    type: String,
    required: true
  }
});

// Virtual for user's URL
CommentSchema.virtual('url').get(function () {
  return '/comment/' + this._id;
});

//Export model
module.exports = mongoose.model('Comment', CommentSchema);
