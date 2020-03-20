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
    ],
    createdAt: {
      type: Date,
      required: true
  }
   
});

module.exports = mongoose.model('User',userSchema);