var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostInstanceSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  body: {
    type: String,
    required: true,
    maxlength: 100
  },
  poster: {
    type: String,
    required: true
  },
  comments: [
    {
      types: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Virtual for user's URL
PostInstanceSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostInstanceSchema);
