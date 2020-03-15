const projectResolver = require('./project');
const userResolver = require('./user');
const commitResolver = require('./commit');
const issueResolver = require('./issue');

const rootResolver = {
    ...projectResolver,
    ...userResolver,
    ...commitResolver,
    ...issueResolver
};

module.exports = rootResolver;