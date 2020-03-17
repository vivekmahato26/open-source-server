const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orgination: {
        type: String,
        required: false
    },
    git: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    tag: [
        {
          type: String,
          required: false
        }
      ],
    slug: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],  
    commits: [{
        type: Schema.Types.ObjectId,
        ref:'Commit'
    }],
    issues: [{
        type: Schema.Types.ObjectId,
        ref:'Issue'
    }],
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Project', projectSchema);