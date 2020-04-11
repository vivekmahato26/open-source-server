import mongoose from 'mongoose';

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
        ref:'ProjectModel'
    },
    createdAt: {
        type: Date,
        required: true
    }
});

export default mongoose.model('CommitModel', commitSchema);