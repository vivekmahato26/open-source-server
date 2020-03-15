const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commitSchema = new Schema({
    commiter: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },  
    project: {
        type: Schema.Types.ObjectId,
        ref:'Project'
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Commit', commitSchema);