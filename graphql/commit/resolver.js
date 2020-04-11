import CommitModel from '../../models/commit'
import ProjectModel from '../../models/commit'

import { projectLoader } from '../populate'

export const Query = { 
    commits: async (_, args, req) => {
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
          const commits = await CommitModel.find()
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
          return commits;
        } catch (err) {
          throw err;
        }
      }
}

export const Mutation = {
    addCommit: async(_, args, req) => {
        if(!req.isAuth) {
            throw new Error('User is not authenticated');
        }
        const commit = new CommitModel({
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
            const project = await ProjectModel.findById(args.commitInput.projectId);
            if (!project) {
                throw new Error('Project not found.');
             }
            project.commits.push(commit);
            await project.save();
            return createdCommit;
        }
        catch(err) {
            throw err;
        }
    }
}

export const Commit = {
    project: (commit) => projectLoader.load(commit.project)
}