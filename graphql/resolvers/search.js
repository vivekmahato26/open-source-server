const User = require("../../models/user");
const Project = require("../../models/project");
const Issue = require("../../models/issue");
const Commit = require("../../models/commit");
const {
  transformProject,
  users,
  transformCommit,
  transformIssue
} = require("./populate");

module.exports = {
  search: async args => {
    try {
      let page = 0;
      let records = 3;
      let pagination = {
        page: parseInt(page),
        limit: parseInt(records),
        skip: parseInt(page * records)
      };
      let projects, user, issues, commits;

      projects = await Project.find({
        name: `"${args.filter}"`
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });

      let fetchedProjects = projects.map(async project => {
        let temp = await transformProject(project);
        return temp;
      });
      user = await User.find({
        sname: `"${args.filter}"` 
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ name: -1 });

      let fetchedUsers = user.map(async u => {
        let temp = await users(u);
        return temp;
      });
      issues = await Issue.find({
        name: `"${args.filter}"`
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });

      let fetchedIssues = issues.map(async issue => {
        let temp = await transformIssue(issue);
        return temp;
      });
      // commits = await Project.find({
      //   message: `"${args.filter}"`
      // })
      //   .skip(pagination.skip)
      //   .limit(pagination.limit)
      //   .sort({ createdAt: -1 });

      console.log(fetchedIssues, fetchedProjects, fetchedUsers);
      //   let fetchedCommits = commits.map(async commit => {
      //     let temp = await transformCommit(commit);
      //     return temp;
      //   });
      let searchRes = {
        ...fetchedProjects,
        ...fetchedUsers,
        ...fetchedIssues
        //...fetchedCommits
      };
      console.log(searchRes);
      return searchRes;
    } catch (err) {
      throw err;
    }
  }
};
