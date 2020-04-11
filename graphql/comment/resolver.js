import CommentModel from '../../models/comment'
import UserModel from '../../models/user'
import ProjectModel from '../../models/project'

import { projectLoader, userLoader, commentLoader } from '../populate'
import comment from '../../models/comment'

export const Query = {
    comments: async (_, args, req) => {
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
          const comments = await CommentModel.find({
            project: args.projectId
          })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
          return comments;
        } catch (err) {
          throw err;
        }
      }
}

export const Mutation = {
    postComment: async (_, args, req) => {
        if (!req.isAuth) {
          throw new Error("User is not authenticated");
        }
        const comment = new CommentModel({
          message: args.commentInput.message,
          project: args.commentInput.project,
          user: req.userId
        });
        let newComment;
        try {
          const res = await comment.save();
          newComment = res;
    
          const project = await ProjectModel.findById(args.commentInput.project);
          if (!project) {
            throw new Error("Project not found.");
          }
          project.comments.push(comment);
          await project.save();
          const user = await UserModel.findById(req.userId);
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
      commentReply: async (args, req) => {
        
        try {
          if (!req.isAuth) {
            throw new Error("User is not authenticated");
          }
          
          const reply = new CommentModel({
            message: args.commentInput.message,
            project: null,
            user: req.userId
          });
          const res = await reply.save();
          const comment = await CommentModel.findById(args.commId);
          if(!comment) {
            throw new Error("Comment does not exist!!!");
          }
          comment.children.push(reply);
          await comment.save();
          return res;
        } catch (err) {
          throw err;
        }
    }
}

export const Comment = {
    project: (comment) => projectLoader.load(comment.project),
    user: (comment) => userLoader.load(comment.user),
    children: (comment) => commentLoader.loadMany(comment.children)
}