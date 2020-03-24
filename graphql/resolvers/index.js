const projectResolver = require('./project');
const userResolver = require('./user');
const commitResolver = require('./commit');
const issueResolver = require('./issue');
<<<<<<< Updated upstream
=======
const userActionResolver = require('./userActions');
>>>>>>> Stashed changes

const rootResolver = {
    ...projectResolver,
    ...userResolver,
    ...commitResolver,
<<<<<<< Updated upstream
    ...issueResolver
=======
    ...issueResolver,
    ...userActionResolver
>>>>>>> Stashed changes
};

module.exports = rootResolver;