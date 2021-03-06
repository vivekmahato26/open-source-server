const Project = require("../../models/project");
const User = require("../../models/user");
const Issue = require("../../models/issue");
const {transformIssue} = require('./populate');

module.exports = {
  raiseIssue: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    let tags = args.issueInput.tag[0].split(',');

    const issue = new Issue({
      name: args.issueInput.name,
      desc: args.issueInput.desc,
      status: args.issueInput.status,
      tag: tags,
      slug: args.issueInput.slug,
      creator: req.userId,
      link: args.issueInput.link,
      project: args.issueInput.projectId,
      createdAt: new Date(args.issueInput.createdAt)
    });
    let createdIssue;
    try {
      const result = await issue.save();
      createdIssue = result;
      const project = await Project.findById(args.issueInput.projectId);
      if (!project) {
        throw new Error("Project not found.");
      }
      project.issues.push(issue);
      await project.save();
      return createdIssue;
    } catch (err) {
      throw err;
    }
  },
  issue: async (args) => {
    try {
      let issues;
      if(args.tag[0] !== null && args.tag[0] !== undefined) {
        issues = await Project.find( { tag: { $in: args.tag} });
      }
      else {
        issues = await Project.find();
      }
      let fetchedIssues = issues.map(async issue => {
        let temp = await transformIssue(issue);
        return temp;
      });
      return fetchedIssues;
    } catch (err) {
      throw err;
    }
  },
  updateIssue: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    issueId = "5e6bd62c4d8e213b10c6758a";
    const issue = await Issue.findByIdAndUpdate({_id:issueId}, {
      status: args.updateIssueInput.status,
      tag: args.updateIssueInput.tag.map(t => {
        return t;
      }),
      type: args.updateIssueInput.type
    });
    let updatedIssue;
    try {
      const resDetails = await issue.save();
      updatedIssue = resDetails;
      return updatedIssue;
    } catch (err) {
      throw err;
    }
  }
};
