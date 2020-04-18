import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import UserModel from '../../models/user'
import ProjectModel from '../../models/project'
import OrganizationModel from '../../models/organization'
import IssueModel from '../../models/issue'
import {
  userLoader,
  messageLoader,
  commentLoader,
  projectLoader,
  orgLoader,
  issueLoader
} from '../populate'

export const Query = {
  login: async (_, args) => {
    const user = await UserModel.findOne({ email: args.loginInput.email })
    if (!user) {
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(
      args.loginInput.password,
      user.password
    )
    if (!isEqual) {
      throw new Error('Invalid Credentials!')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRATION
      }
    )
    return { userId: user.id, token: token }
  },
  user: async (_, args) => {
    try {
      const user = await userLoader.load(args.userId)
      return user
    } catch (err) {
      throw err
    }
  },
  search: async (_, args) => {
    try {
      let page = 0
      let records = 3
      let pagination = {
        page: parseInt(page),
        limit: parseInt(records),
        skip: parseInt(page * records)
      }
      let projects, users, issues, organizations
      var re = new RegExp(args.filter, 'i')

      projects = await ProjectModel.find({ $text: { $search: args.filter } })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 })

      users = await UserModel.find({ $text: { $search: args.filter } })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ name: -1 })

      issues = await IssueModel.find({ $text: { $search: args.filter } })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 })

      organizations = await OrganizationModel.find({
        $text: { $search: args.filter }
      })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 })

      let searchRes = {
        ...users,
        ...projects,
        ...issues,
        ...organizations
      }
      console.log(searchRes)

      return searchRes
    } catch (err) {
      throw err
    }
  }
}

export const Mutation = {
  createUser: async (_, args) => {
    try {
      const checkEmail = await UserModel.findOne({
        email: args.userLoginInput.email
      })
      if (checkEmail) {
        throw new Error('Email already registered')
      }
      const hashedPass = await bcrypt.hash(args.userLoginInput.password, 12)
      const userLogin = new UserModel({
        sname: args.userLoginInput.sname,
        email: args.userLoginInput.email,
        password: hashedPass
      })
      const res = await userLogin.save()
      return { ...res._doc, _id: res.id }
    } catch (err) {
      throw err
    }
  },
  updateUser: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated!')
    }
    let social = args.userInput.social[0].split(',')
    const user = await UserModel.findByIdAndUpdate(
      { _id: req.userId },
      {
        profilePic: args.userInput.profilePic,
        name: args.userInput.name,
        bio: args.userInput.bio,
        social
      },
      { new: true }
    )
    let updatedUser
    try {
      const resDetails = await user.save()
      updatedUser = resDetails
      return updatedUser
    } catch (err) {
      throw err
    }
  },
  followUser: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }

    try {
      const follow = await UserModel.findByIdAndUpdate(
        { _id: req.userId },
        {
          $push: { following: args.following }
        },
        {
          new: true
        }
      )

      const user = await UserModel.findById(args.following)
      if (!user) {
        throw new Error('user not found.')
      }
      user.followers.push(follow)
      await user.save()
      return follow
    } catch (err) {
      throw err
    }
  },
  unfollowUser: async (_, args, req) => {
    if (!req.isAuth) {
      throw new Error('User is not authenticated')
    }
    try {
      const follow = await UserModel.findByIdAndUpdate(
        { _id: req.userId },
        {
          $pull: { following: args.following }
        },
        {
          new: true
        }
      )

      const user = await UserModel.findById(args.following)
      if (!user) {
        throw new Error('user not found.')
      }
      user.followers.pull(follow)
      await user.save()
      return follow
    } catch (err) {
      throw err
    }
  }
}

export const User = {
  owned: user => projectLoader.loadMany(user.owned),
  // contributions: (user) => projectLoader.loadMany(user.contributions),
  comments: user => commentLoader.loadMany(user.comments),
  messages: user => messageLoader.loadMany(user.messages),
  followers: user => userLoader.loadMany(user.followers),
  following: user => userLoader.loadMany(user.following)
}

// export const Search = {
//   users: (search) => userLoader.loadMany(search.users),
//   projects: (search) => projectLoader.loadMany(search.projects),
//   issues: (search) => issueLoader.loadMany(search.issues),
//   organizations: (search) => orgLoader.loadMany(search.organizations)
// }

export const Search = {
  __resolveType(value) {
    if (value.desc) {
      return 'Project'
    }
    if (value.website) {
      return 'Organization'
    }
    if (value.profilePic) {
      return 'User'
    }
    return null
  }
}
