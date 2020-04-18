import Base from '../base'
import Project from '../project/schema'
import Comment from '../comment/schema'
import Message from '../message/schema'
import Organization from '../organization/schema'
import Issue from '../issue/schema'

const User = `
    type User {
        _id: ID!
        profilePic: String
        sname: String!
        email: String!
        name: String
        bio: String
        social: [String]
        messages: [Message]
        owned: [Project]
        comments: [Comment]
        followers: [User]
        following: [User]
        createdAt: String!
        updatedAt: String!
    }
    
    input UserLoginInput {
        sname: String!
        email: String!
        password: String!
    }

    input UserInput {
        profilePic: String
        name: String!
        bio: String!
        social: [String]
    }
    input LoginInput {
        email: String!
        password: String!
    }

    type AuthData {
        userId: ID!
        token: String!
    }

    union Search = User | Project | Organization

    

    extend type Query {
        login(loginInput:LoginInput!): AuthData!
        user(userId: ID!): User!
        search(filter: String):Search
    }

    extend type Mutation {
        followUser(following: String!): User
        unfollowUser(following: String!): User
        createUser(userLoginInput:UserLoginInput):User
        updateUser(userInput:UserInput):User
    }
`

export default () => [User, Message, Project, Organization, Issue, Comment, Base]
