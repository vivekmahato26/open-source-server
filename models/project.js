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
<<<<<<< Updated upstream
        type: String,
        required: false
    },
=======
        type: Schema.Types.ObjectId,
        ref: 'Orgination'
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
    },
        
    adopter: [{
           type: Schema.Types.ObjectId,
           ref: 'Orgination'
    }],
    
>>>>>>> Stashed changes
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

module.exports = mongoose.model('Project', projectSchema);