import Base from '../base';
import Project from '../project/schema';

const Issue = `
    type Issue {
        _id: ID!
        name: String!
        desc: String!
        status: String!
        tag: [String]
        slug: String!
        link: String!
        creator: String!
        project: Project!
        createdAt: String!
        updatedAt: String!
    }

    input IssueInput {
        name: String!
        desc: String!
        slug: String!
        projectId: String!
        status: String!
        tag: [String!]
        link: String!
        createdAt: String!
    }

    input UpdateIssueInput {
        issueId: String!
        status: String!
        tag: [String!]
    }
    extend type Mutation {
        raiseIssue(issueInput: IssueInput): Issue
        updateIssue(updateIssueInput: UpdateIssueInput): Issue
    }        

    extend type Query {
        issue(tag:[String]): [Issue!]!
    }
        
`;

export default () => [Issue, Project, Base];