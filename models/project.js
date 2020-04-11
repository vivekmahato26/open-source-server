import mongoose from 'mongoose';

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
        ref: 'UserModel'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationModel'
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
        ref: 'UserModel'
    }],
        
    adopter: [{
           type: Schema.Types.ObjectId,
           ref: 'OrganizationModel'
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
        ref:'CommitModel'
    }],
    issues: [{
        type: Schema.Types.ObjectId,
        ref:'IssueModel'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'CommentModel'
    }]
},{
    timestamps: true
});
projectSchema.index({name:'text',desc:'text',category:'text',tag:'text'});
export default mongoose.model('ProjectModel', projectSchema);
