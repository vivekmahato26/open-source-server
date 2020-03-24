const User = require('../../models/user');
const Project = require('../../models/project');
const Commit = require('../../models/commit');
const Issue = require('../../models/issue');
const Comment = require('../../models/comment');
const DataLoader = require('dataloader');

const projectLoader = new DataLoader(projectIds => {
  return projects(projectIds);
});

const commitLoader = new DataLoader(commitIds => {
  return commits(commitIds);
});

const issueLoader = new DataLoader(issueIds => {
  return issues(issueIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
})

const commentLoader = new DataLoader(commentIds => {
  return comments(commentIds);
})

const projects = async projectIds =>  {
    try {
      const projects = await Project.find({ _id: { $in: projectIds } });
      projects.map(project => {
        return transformProject(project);
      });
      return projects;
    } catch (err) {
      throw err;
    }
  };

const commits = async commitIds => {
  try {
    const commits = await Commit.find({_id: {$in: commitIds}});
    commits.map(commit => {
      return transformCommit(commit);
    });
    return commits;
  } catch(err) {
    throw err;
  }
}

const issues = async issueIds => {
  try {
    const issues = await Issue.find({_id: {$in: issueIds}});
    issues.map(issue => {
      return transformIssue(issue);
    });
    return issues;
  } catch(err) {
    throw err;
  }
}

  const singleProjet = async projectId => {
    try {
      const project = await projectLoader.load(projectId.toString());
      return project;
    } catch (err) {
      throw err;
    }
  };
  
  const users = async userId =>  {
    try {
      const user = await userLoader.load(userId.toString());
      return {
        ...user._doc,
        _id: user.id,
        owned: () => projectLoader.loadMany(user._doc.owned)
      };
    } catch (err) {
      throw err;
    }
  };

  const transformProject = async project => {
    let temp = await users(project.admin);
    return {
      ...project._doc,
      _id: project.id,
      createdAt: new Date(project._doc.createdAt),
      admin: temp,
      commits: () => commitLoader.loadMany(project._doc.commits),
      issues: () => issueLoader.loadMany(project._doc.issues)
    };
  };

  const transformCommit = async commit => {
    let tempProject = await projects(commit.project);
    return {
      ...commit._doc,
      _id: commit.id,
      createdAt: new Date(commit._doc.createdAt),
      project: tempProject
    }
  }

  const transformIssue = async issue => {
    let tempProject = await projects(issue.project);
    return {
      ...issue._doc,
      _id: issue.id,
      createdAt: new Date(issue._doc.createdAt),
      project: tempProject
    }
  }


  const transformComment = async comment => {
    let tempProject = await projects(comment.projectId);
    let tempUser = await user(comment.userId);
    return {
      ...comment.doc,
      _id: comment.id,
      createdAt: new Date(comment._doc.createdAt),
      projectId: tempProject,
      userId: tempUser
    }

  }

  const transformMessage = async message => {
    let sender = await user(message.sender);
    let receiver = message.receiver.map( async uid => {
      return await user(uid);
    })
    return {
      ...comment.doc,
      _id: comment.id,
      createdAt: new Date(comment._doc.createdAt),
      sender: sender,
      receiver: receiver
    }

  }
module.exports = {transformProject,users,transformCommit,transformIssue,transformComment,transformMessage};