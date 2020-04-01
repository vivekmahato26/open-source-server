const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orgSchema = new Schema({
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
        ref: 'Project'
    }],
    adopted: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    icon: [{
        type: String,
        require: false
    }]
});
orgSchema.index({name:'text',website:'text'});
module.exports = mongoose.model('Organization',orgSchema);