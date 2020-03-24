const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orgSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true,
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    adopted: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    logo: [{
        type: String,
        require: false
    }]
});

module.exports = mongoose.model('Orgination',orgSchema);