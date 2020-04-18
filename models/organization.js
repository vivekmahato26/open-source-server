import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orgSchema = new Schema({
    logo: {
        type: String,
        required: false
    },
    name:{
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false,
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'ProjectModel'
    }],
    adopted: [{
        type: Schema.Types.ObjectId,
        ref: 'ProjectModel'
    }],
    icon: [{
        type: String,
        require: false
    }]
},{
    timestamps: true
});
orgSchema.index({name:'text',website:'text'});
export default mongoose.model('OrganizationModel',orgSchema);