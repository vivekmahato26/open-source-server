import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    profilePic: {
      type: String,
      required: false
    },
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
        ref: 'ProjectModel'
      }
    ],
    owned: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProjectModel'
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CommentModel'
      }
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
      }
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MessageModel'
      }
    ]
  },
  {
    timestamps: true
  }
)

userSchema.index({ name: 'text', email: 'text', sname: 'text' })

export default mongoose.model('UserModel', userSchema)
