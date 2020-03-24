const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: [{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Message',messageSchema);