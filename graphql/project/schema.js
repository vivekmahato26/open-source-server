import Base from '../base';
import User from '../user/schema';
import Commit from '../commit/schema';
import Issue from '../issue/schema';
import Comment from '../comment/schema';
import Organization from '../organization/schema';

const Project = `
    type Project {
        _id: ID!
        name: String!
        desc: String
        organization: Organization
        admin: User
        tag: [String]
        category: String!
        community: Community
        adopter: [Organization]
        likes: [User]
        slug: String!
        commits: [Commit]
        issues: [Issue]
        comments: [Comment]
        createdAt: String!
        updatedAt: String!
    }

    type Community {
        github: String
        website: String
        slack:String
        facebook:String
        discord:String
        twitter:String
    }

    input CommunityInput {
        github: String
        website: String
        slack:String
        facebook:String
        discord:String
        twitter:String
    }

    input ProjectInput {
        name: String!
        desc: String!
        slug: String!
        organization: String
        tag: [String!]
        category: String!

    }

    input UpdateProject {
        projectId: String!
        community: CommunityInput
        adopter:[String]
    }

    input ProjectFilter{
        userId: String
        tag: [String]
        category: String
    }

    extend type Mutation {
        addProject(projectInput: ProjectInput): Project
        updateProject(updateInput: UpdateProject): Project
        addLikes(projectId: String): Project
        dislike(projectId: String): Project
    }        

    extend type Query {
        projects(projectFilter: ProjectFilter): [Project!]!
        project(projectId: String!): Project
    }
        
`;

export default () => [Project, User, Organization, Comment, Commit, Issue, Base];