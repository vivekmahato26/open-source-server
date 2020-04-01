const Project = require('../../models/project');
const User = require('../../models/user');
const Commit = require('../../models/commit');
const {transformCommit} = require('./populate');

module.exports = {
    addCommit: async(args, req) => {
        if(!req.isAuth) {
            throw new Error('User is not authenticated');
        }
        const commit = new Commit({
            commiter: args.commitInput.commiter,
            message: args.commitInput.message,
            slug: args.commitInput.slug,
            link: args.commitInput.link,
            project: args.commitInput.projectId,
            createdAt: new Date(args.commitInput.createdAt),
        });
        let createdCommit;
        try {
            const result = await commit.save();
            createdCommit = result;
            const project = await Project.findById(args.commitInput.projectId);
            if (!project) {
                throw new Error('Project not found.');
             }
            project.commits.push(commit);
            await project.save();
            // const user = await User.findById(req.userId);
            // if (!user) {
            //     throw new Error('User not found.');
            //  }
            // user.contributions.push(commit);
            // await user.save();
            return createdCommit;
        }
        catch(err) {
            throw err;
        }
    },
    commits: async (args,req) => {
        try {
          let page = 0;
          let records = 4;
          if (Object.keys(req.query).length !== 0) {
            page = req.query.page;
            records = req.query.records;
          }
          let pagination = {
            page: parseInt(page),
            limit: parseInt(records),
            skip: parseInt(page * records)
          };
          const commits = await Commit.find()
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
          let fetchedCommits = commits.map(async commit => {
            let temp = await transformCommit(commit);
            return temp;
          });
          return fetchedCommits;
        } catch (err) {
          throw err;
        }
      }
}