const Comment = require("../../models/comment");
const Message = require("../../models/message");

const User = require("../../models/user");
const Project = require("../../models/project");
const Issue = require("../../models/issue");

const {
  transformComment,
  transformMessage,
  transformProject,
  users,
  transformIssue
} = require("./populate");

module.exports = {
  postComment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const comment = new Comment({
      message: args.commentInput.message,
      project: args.commentInput.project,
      createdAt: new Date(args.commentInput.createdAt),
      user: req.userId
    });
    let newComment;
    try {
      const res = await comment.save();
      newComment = res;

      const project = await Project.findById(args.commentInput.project);
      if (!project) {
        throw new Error("Project not found.");
      }
      project.comments.push(comment);
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("user not found.");
      }
      user.comments.push(comment);
      await user.save();
      return newComment;
    } catch (err) {
      throw err;
    }
  },
  comments: async (args, req) => {
    try {
      let page = 0;
      let records = 10;
      if (Object.keys(req.query).length !== 0) {
        page = req.query.page;
        records = req.query.records;
      }
      let pagination = {
        page: parseInt(page),
        limit: parseInt(records),
        skip: parseInt(page * records)
      };
      const comments = await Comment.find({
        project: args.projectId
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });
      let fetchedComments = comments.map(async comment => {
        let temp = await transformComment(comment);
        return temp;
      });
      return fetchedComments;
    } catch (err) {
      throw err;
    }
  },
  sendMessage: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const message = new Message({
      message: args.messageInput.message,
      receiver: args.messageInput.receiver,
      createdAt: new Date(args.messageInput.createdAt),
      sender: req.userId
    });
    let newMessage;
    try {
      const res = await message.save();
      newMessage = res;

      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("user not found.");
      }
      user.messages.push(message);
      await user.save();
      return newMessage;
    } catch (err) {
      throw err;
    }
  },
  messages: async req => {
    try {
      let page = 0;
      let records = 25;
      if (Object.keys(req.query).length !== 0) {
        page = req.query.page;
        records = req.query.records;
      }
      let pagination = {
        page: parseInt(page),
        limit: parseInt(records),
        skip: parseInt(page * records)
      };
      const messages = await Message.find({
        $or: [{ receiver: req.userId }, { sender: req.userId }]
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });
      let fetchedMessages = messages.map(async message => {
        let temp = await transformMessage(message);
        return temp;
      });
      return fetchedMessages;
    } catch (err) {
      throw err;
    }
  },
  followUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const follow = User.findByIdAndUpdate(
      { _id: req.userId },
      {
        $push: { following: args.following }
      }
    );
    let newFollow;
    try {
      const res = await follow.save();
      newFollow = res;

      const user = await User.findById(args.following);
      if (!user) {
        throw new Error("user not found.");
      }
      user.follower.push(follow);
      await user.save();
      return newFollow;
    } catch (err) {
      throw err;
    }
  },
  unfollowUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const follow = User.findByIdAndUpdate(
      { _id: req.userId },
      {
        $pull: { following: args.following }
      }
    );
    let newFollow;
    try {
      const res = await follow.save();
      newFollow = res;

      const user = await User.findById(args.following);
      if (!user) {
        throw new Error("user not found.");
      }
      user.follower.pull(follow);
      await user.save();
      return newFollow;
    } catch (err) {
      throw err;
    }
  },
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
        name: args.filter
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });

      let fetchedProjects = projects.map(async project => {
        let temp = await transformProject(project);
        return temp;
      });
      user = await User.find({
        sname: args.filter
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ name: -1 });

      let fetchedUsers = user.map(async u => {
        let temp = await users(u);
        return temp;
      });
      issues = await Issue.find({
        name: args.filter
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });

      let fetchedIssues = issues.map(async issue => {
        let temp = await transformIssue(issue);
        return temp;
      });
      commits = await Project.find({
        message: `"${args.filter}"`
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });

      let searchRes = [...fetchedProjects, ...fetchedUsers, ...fetchedIssues];
      console.log(searchRes);
      return fetchedProjects;
    } catch (err) {
      throw err;
    }
  }
};
