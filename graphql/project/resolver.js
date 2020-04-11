import ProjectModel from '../../models/project'
import OrganizationModel from '../../models/organization'
import UserModel from '../../models/user'
import {
  userLoader,
  commentLoader,
  commitLoader,
  issueLoader,
  orgLoader
} from '../populate'

export const Query = {
  projects: async (_, args, req) => {
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
      let projects
      if (
        args.projectFilter.category !== null &&
        args.projectFilter.category !== undefined
      ) {
        projects = await ProjectModel.find({
          category: args.projectFilter.category
        })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 })
      } else if (
        args.projectFilter.tag[0] !== null &&
        args.projectFilter.tag[0] !== undefined
      ) {
        projects = await ProjectModel.find({
          tag: { $in: args.projectFilter.tag }
        })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 })
      } else if (
        args.projectFilter.userId !== null &&
        args.projectFilter.userId !== undefined
      ) {
        projects = await ProjectModel.find({ admin: args.projectFilter.userId })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 })
      }
      // else if (
      //   args.projectFilter.projectId !== null &&
      //   args.projectFilter.projectId.length !== 0
      // ){
      //   let temp;
      //   let pid = args.projectFilter.projectId;
      //   for(i = 0; i < pid.length; i++){
      //     temp = await ProjectModel.findById(pid[i]);
      //     console.log(temp);
      //     projects.push(temp);
      //   }
      // }
      else {
        projects = await ProjectModel.find()
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ createdAt: -1 })
      }
      return projects
    } catch (err) {
      throw err
    }
  }
}

export const Mutation = {
  addProject: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    let orgId
    let tags = args.projectInput.tag[0].split(',')
    var re = new RegExp(args.projectInput.organization, 'i')
    const org = await OrganizationModel.find({ name: { $regex: re } })
    if (org.length === 0) {
      const organization = new OrganizationModel({
        name: args.projectInput.organization,
      })

      const res = await organization.save()
      orgId = res._id
    } else {
      orgId = org[0]._id
    }
    const project = new ProjectModel({
      name: args.projectInput.name,
      desc: args.projectInput.desc,
      organization: orgId,
      admin: req.userId,
      tag: tags,
      category: args.projectInput.category,
      slug: args.projectInput.slug,
    })
    try {
      const result = await project.save()
      const admin = await UserModel.findById(req.userId)

      if (!admin) {
        throw new Error('User not found.')
      }
      admin.owned.push(project)
      await admin.save()

      const org = await OrganizationModel.findById(orgId)
      if (!org) {
        throw new Error('Organization not found')
      }
      org.projects.push(project)
      await org.save()

      return result
    } catch (err) {
      throw err
    }
  },
  updateProject: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    let community = args.updateInput.community
    let adopters = args.updateInput.adopter[0].split(',')
    let adopter = []
    for (var i = 0; i < adopters.length; i++) {
      var re = new RegExp(adopters[i], 'i')
      const org = await OrganizationModel.find({ name: { $regex: re } })
      if (org.length === 0) {
        const organization = new OrganizationModel({
          name: adopters[i]
        })
        const res = await organization.save()
        adopter.push(res._id)
      } else {
        adopter.push(org[0]._id)
      }
    }

    const project = await ProjectModel.findByIdAndUpdate(
      { _id: args.updateInput.projectId },
      {
        community,
        adopter
      },
      { new: true }
    )
    let updatedProject
    try {
      const resDetails = await project.save()
      updatedProject = resDetails
      adopter.map(async o => {
        const org = await OrganizationModel.findById(o)
        if (!org) {
          throw new Error('Organization not found')
        }
        org.adopted.push(project)
        await org.save()
      })
      return updatedProject
    } catch (err) {
      throw err
    }
  },
  addLikes: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    const project = await ProjectModel.findByIdAndUpdate(
      { _id: args.projectId },
      {
        $push: { likes: req.userId }
      },
      { new: true }
    )
    let updatedProject
    try {
      const resDetails = await project.save()
      updatedProject = resDetails
      return updatedProject
    } catch (err) {
      throw err
    }
  },
  dislike: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    const project = await ProjectModel.findByIdAndUpdate(
      { _id: args.projectId },
      {
        $pull: { likes: req.userId }
      },
      { new: true }
    )
    let updatedProject
    try {
      const resDetails = await project.save()
      updatedProject = resDetails
      return updatedProject
    } catch (err) {
      throw err
    }
  }
}
export const Project = {
  admin: project => userLoader.load(project.admin),
  organization: project => orgLoader.load(project.organization),
  comments: project => commentLoader.loadMany(project.comments),
  issues: project => issueLoader.loadMany(project.issues),
  commits: project => commitLoader.loadMany(project.commits),
  adopter: project => orgLoader.loadMany(project.adopter),
  likes: project => userLoader.loadMany(project.likes)
}
