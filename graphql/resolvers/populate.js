const User = require('../../models/user');
const Message = require("../../models/message");
const Project = require('../../models/project');
const Commit = require('../../models/commit');
const Issue = require('../../models/issue');
const Comment = require('../../models/comment');
const Organization = require("../../models/organization");
const DataLoader = require('dataloader');

const projectLoader = new DataLoader(projectIds => {
  return projects(projectIds);
});

const messageLoader = new DataLoader(messageIds => {
  return Message.find({_id:{$in:messageIds}});
});

const projLoader = new DataLoader(projectIds => {
  return Project.find({_id:{$in:projectIds}});
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

const usersLoader = new DataLoader(userIds => {
  return users(userIds);
});

const commentLoader = new DataLoader(commentIds => {
  return comments(commentIds);
})

const orgLoader = new DataLoader(orgIds => {
  return Organization.find({ _id: { $in: orgIds } });
})

const orgs = async orgId => {
  try {
    const organizations = await orgLoader.load(orgId.toString());
      return {
        ...organizations._doc,
        _id:organizations.id,
        projects: () => projectLoader.loadMany(organizations._doc.projects),
        adopted: () => projectLoader.loadMany(organizations._doc.adopted)
    }
  }
  catch(err) {
    throw(err);
  }
}

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
const comments = async commentIds => {
  try{
    const comments = await Comment.find({_id:{$in:commentIds}});
    comments.map(comment => {return transformComment(comment)});
    return comments;
  }
  catch(err){
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

  const singleProject = async projectId => {
    try {
      const project = await projectLoader.load(projectId.toString());
      return {
        ...project._doc,
        _id: project.id,
        comments: () => commentLoader.loadMany(project._doc.comments),
        commits: () => commitLoader.loadMany(project._doc.commits),
        issues: () => issueLoader.loadMany(project._doc.issues),
      };
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
        owned: () => projectLoader.loadMany(user._doc.owned),
        comments: () => commentLoader.loadMany(user._doc.comments),
        messages: () => messageLoader.loadMany(user._doc.messages),
        contributed: () => issueLoader.loadMany(user._doc.contributed)
      };
    } catch (err) {
      throw err;
    }
  };

  const transformProject = async project => {
    let temp =  await users(project.admin);
    let org =  await orgs(project.organization);
    return  {
      ...project._doc,
      _id: project.id,
      createdAt: new Date(project._doc.createdAt),
      admin: () => users(project.admin),
      organization: () => orgs(project.organization),
      commits: () => commitLoader.loadMany(project._doc.commits),
      issues: () => issueLoader.loadMany(project._doc.issues),
      comments: () => commentLoader.loadMany(project._doc.comments)
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
    let tempUser = await users(comment.user);

    let tempProject = await singleProject(comment.project);
    return {
      ...comment._doc,
      _id: comment.id,
      createdAt: new Date(comment._doc.createdAt),
      project: tempProject,
      user: tempUser
    }

  }

  const transformOrg = async org => {
    return {
      ...org._doc,
      _id: org.id,
      projects: () => projectLoader.loadMany(org._doc.projects),
      adopted: () => projectLoader.loadMany(org._doc.adopted)
    }
  }

  const transformMessage = async message => {
    let sender = await users(message.sender);
    
    return {
      ...message._doc,
      _id: message.id,
      createdAt: new Date(message._doc.createdAt),
      sender: sender,
      receiver:() => usersLoader.loadMany(message._doc.receiver)
    }

  }
module.exports = {transformProject,transformOrg,users,transformCommit,transformIssue,transformComment,transformMessage};