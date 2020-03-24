const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    sname: {
        type: String,
        required: true
      },
    email: {
          type: String,
          required: true
        },
    password: {
          type: String,
          required: true
      },
    name: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    social: [
          {
              type: String,
              required: false
          }
    ],
    contributions: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Project'
        }
    ],
    owned: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project'
      }
<<<<<<< Updated upstream
    ]
=======
    ],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    follower: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    messages: [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }],
    createdAt: {
      type: Date,
      required: true
  }
>>>>>>> Stashed changes
   
});

module.exports = mongoose.model('User',userSchema);