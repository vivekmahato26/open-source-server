const {buildSchema} = require('graphql');

const {ProjectTypes,ProjectMutation,ProjectQuery} = require('./project');
const {UserTypes,UserQuery,UserMutation} = require('./user');
const {UserActionsTypes,UserActionsQuery,UserActionsMutations} = require('./userActions');

module.exports = buildSchema(`
    ${UserTypes}
    ${ProjectTypes}
    ${UserActionsTypes}
    type RootMutation {
        ${ProjectMutation}
        ${UserMutation}
        ${UserActionsMutations}
    }
    type RootQuery {
        ${ProjectQuery}
        ${UserQuery}
        ${UserActionsQuery}
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

