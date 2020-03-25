const projectResolver = require('./project');
const userResolver = require('./user');
const commitResolver = require('./commit');
const issueResolver = require('./issue');
const userActionResolver = require('./userActions');

const rootResolver = {
    ...projectResolver,
    ...userResolver,
    ...commitResolver,
    ...issueResolver,
    ...userActionResolver
};

module.exports = rootResolver;