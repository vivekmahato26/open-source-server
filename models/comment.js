const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    children: {
        type: [ {
          type: Schema.Types.ObjectId,
          ref: 'Comment',
        }],
        default: [],
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Comment',commentSchema);