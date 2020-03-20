const projectResolver = require('./project');
const userResolver = require('./user');
const commitResolver = require('./commit');
const issueResolver = require('./issue');
const searchResolver = require('./search');

const rootResolver = {
    ...projectResolver,
    ...userResolver,
    ...commitResolver,
    ...issueResolver,
    ...searchResolver
};

module.exports = rootResolver;