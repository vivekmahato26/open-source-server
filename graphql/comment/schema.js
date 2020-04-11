import Base from '../base';
import Project from '../project/schema';
import User from '../user/schema';

const Comment =  `
    type Comment {
        _id: ID!
        message: String!
        user: User!
        project: Project
        children: [Comment]
        createdAt: String!
        updatedAt: String!
    }
    
    input CommentInput {
        message: String!
        project: String
    }

    extend type Mutation {
        postComment(commentInput: CommentInput): Comment
        commentReply(commId: String!,commentInput: CommentInput): Comment
    }
                            
    extend type Query {
        comments(projectId:String!): [Comment]
    }
`;

export default () => [Comment, User, Project, Base];