import IssueModel from '../../models/issue'
import ProjectModel from '../../models/project'

import { projectLoader } from '../populate'

export const Query = {
  issue: async (_, args, req) => {
    try {
      let page = 0
      let records = 4
      if (Object.keys(req.query).length !== 0) {
        page = req.query.page
        records = req.query.records
      }
      let pagination = {
        page: parseInt(page),
        limit: parseInt(records),
        skip: parseInt(page * records)
      }
      let issues
      if (args.tag[0] !== null && args.tag[0] !== undefined) {
        issues = await IssueModel.find({ tag: { $in: args.tag } })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 })
      } else {
        issues = await IssueModel.find()
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 })
      }
      return issues
    } catch (err) {
      throw err
    }
  }
}

export const Mutation = {
  raiseIssue: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    let tags = args.issueInput.tag[0].split(',')

    const issue = new IssueModel({
      name: args.issueInput.name,
      desc: args.issueInput.desc,
      status: args.issueInput.status,
      tag: tags,
      slug: args.issueInput.slug,
      creator: req.userId,
      link: args.issueInput.link,
      project: args.issueInput.projectId,
      createdAt: new Date(args.issueInput.createdAt)
    })
    let createdIssue
    try {
      const result = await issue.save()
      createdIssue = result
      const project = await ProjectModel.findById(args.issueInput.projectId)
      if (!project) {
        throw new Error('Project not found.')
      }
      project.issues.push(issue)
      await project.save()
      // const user = await User.findById(req.userId);
      // if (!user) {
      //     throw new Error('User not found.');
      //  }
      // user.contributions.push(commit);
      // await user.save();
      return createdIssue
    } catch (err) {
      throw err
    }
  },
  updateIssue: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    // TODO: issue update id fetch from frontend and send with req headers
    issueId = '5e6bd62c4d8e213b10c6758a'
    const issue = await Issue.findByIdAndUpdate(
      { _id: issueId },
      {
        status: args.updateIssueInput.status,
        tag: args.updateIssueInput.tag.map(t => {
          return t
        }),
        type: args.updateIssueInput.type
      }
    )
    let updatedIssue
    try {
      const resDetails = await issue.save()
      updatedIssue = resDetails
      return updatedIssue
    } catch (err) {
      throw err
    }
  }
}

export const Issue = {
  project: issue => projectLoader.load(issue.project)
}
