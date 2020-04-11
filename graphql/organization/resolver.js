import OrganizationModel from '../../models/organization'
import { projectLoader } from '../populate'

export const Query = {
  orgSearch: async (_, args) => {
    try {
      var re = new RegExp(args.filter, 'i')
      const org = await OrganizationModel.find({ name: { $regex: re } })
        .limit(4)
        .sort({ createdAt: -1 })
      return org
    } catch (err) {
      throw err
    }
  }
}

export const Mutation = {
  addOrganization: async (_, args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('User is not authenticated')
      }
      const organization = new OrganizationModel({
        name: args.orgInput.name,
        website: args.orgInput.website,
        icon: args.orgInput.icon
      })

      const res = await organization.save()
      return res
    } catch (err) {
      throw err
    }
  }
}

export const Organization = {
  adopted: organization => projectLoader.loadMany(organization.adopted),
  projects: organization => projectLoader.loadMany(organization.projects)
}
