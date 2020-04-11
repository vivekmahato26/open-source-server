import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'ProjectModel'
    },
    children: {
        type: [ {
          type: Schema.Types.ObjectId,
          ref: 'CommentModel',
        }],
        default: [],
    }
},{
    timestamps: true
});

export default mongoose.model('CommentModel',commentSchema);