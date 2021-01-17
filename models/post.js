var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
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
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Virtual for user's URL
PostSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostSchema);
