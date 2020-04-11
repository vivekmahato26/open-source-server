import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    receiver: [{
        type:Schema.Types.ObjectId,
        ref: 'UserModel'
    }]
},{
    timestamps: true
});

export default mongoose.model('MessageModel',messageSchema);
