const {buildSchema} = require('graphql');

const {ProjectTypes,ProjectMutation,ProjectQuery} = require('./project');
const {UserTypes,UserQuery,UserMutation} = require('./user');

module.exports = buildSchema(`
    ${UserTypes}
    ${ProjectTypes}
    type RootMutation {
        ${ProjectMutation}
        ${UserMutation}
    }
    type RootQuery {
        ${ProjectQuery}
        ${UserQuery}
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

