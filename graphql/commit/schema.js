import Base from '../base';
import Project from '../project/schema';

const Commit = `
    type Commit {
        _id: ID!
        commiter: String!
        message: String!
        link: String!
        slug: String!
        project: Project!
        createdAt: String!
        updatedAt: String!
    }
    
    input CommitInput {
        commiter: String!
        message: String!
        projectId: String!
        slug: String!
        link: String!
        createdAt: String!
    }

    extend type Mutation {
        addCommit(commitInput: CommitInput): Commit
    }        

    extend type Query {
        commits: [Commit!]!
    }
        
`;

export default () => [Commit, Project, Base];