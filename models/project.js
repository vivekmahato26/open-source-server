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
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    community: {
        github: {
            type: String,
            required: false
        },
        website: {
            type: String,
            required: false
        },
        slack: {
            type: String,
            required: false
        },
        facebook: {
            type: String,
            required: false
        },
        discord: {
            type: String,
            required: false
        },
        twitter: {
            type: String,
            required: false
        }
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
        
    adopter: [{
           type: Schema.Types.ObjectId,
           ref: 'Organization'
    }],
    
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
    commits: [{
        type: Schema.Types.ObjectId,
        ref:'Commit'
    }],
    issues: [{
        type: Schema.Types.ObjectId,
        ref:'Issue'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        required: true
    }
});
projectSchema.index({name:'text',desc:'text',category:'text',tag:'text'});
module.exports = mongoose.model('Project', projectSchema);