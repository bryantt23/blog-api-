var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserInstanceSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  posts: [
    {
      types: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

// Virtual for user's URL
UserInstanceSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserInstanceSchema);
