import UserModel from "../models/user"
import MessageModel from "../models/message"
import ProjectModel from "../models/project"
import CommitModel from "../models/commit"
import IssueModel from "../models/issue"
import CommentModel from "../models/comment"
import OrganizationModel from "../models/organization"
import DataLoader from "dataloader"

export const projectLoader = new DataLoader(async projectIds => {
  const projects = await ProjectModel.find({'_id': { '$in': projectIds } }).exec();
  return  mapResult(projectIds,projects)
});

export const messageLoader = new DataLoader(async messageIds => {
  const messages = await MessageModel.find({ _id: { $in: messageIds } }).exec();
  return messageIds.map( id => messages.find((message) => message._id.toString() === id.toString()) )
});

export const commitLoader = new DataLoader(async commitIds => {
  const commits = await CommitModel.find({'_id': { '$in': commitIds } }).exec();
  return  mapResult(commitIds,commits)
});

export const issueLoader = new DataLoader(async issueIds => {
  const issues = await IssueModel.find({'_id': { '$in': issueIds } }).exec();
  return  mapResult(issueIds,issues)
});

export const userLoader = new DataLoader( async userIds => {
  const users = await UserModel.find({'_id': { '$in': userIds } }).exec();
  return  mapResult(userIds,users)
  
});

export const commentLoader = new DataLoader(async commentIds => {
  const comments = await CommentModel.find({'_id': { '$in': commentIds } }).exec();
  return  mapResult(commentIds,comments)
});

export const orgLoader = new DataLoader(async orgIds => {
  const organization = await OrganizationModel.find({'_id': { '$in': orgIds } }).exec();
  return  mapResult(orgIds,organization)
});


const mapResult = (ids, result) => {
  return  ids.map(id => result.find((res) => res._id.toString() === id.toString()))
}
