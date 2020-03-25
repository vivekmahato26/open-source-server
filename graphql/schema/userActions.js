module.exports = {
    UserActionsTypes : `
        type Message {
            _id: ID!
            message: String!
            sender: User!
            receiver: [User!]
            createdAt: String!
        }
        input MessageInput {
            message: String!
            receiver: String!
            createdAt: String!
        }

        type Comment {
            _id: ID!
            message: String!
            user: User!
            project: Project!
            createdAt: String!
            children: [Comment]
        }
        
        input CommentInput {
            message: String!
            project: String!
            createdAt: String!
        }

        type Search {
            users: [User]
            projects: [Project]
            issues: [Issue]
        }

    `,
    UserActionsMutations: `postComment(commentInput: CommentInput): Comment
                            commentReply(commId: String!,message: String!): Comment
                            followUser(following: String!): User
                            unfollowUser(following: String!): User
                            sendMessage(messageInput: MessageInput): Message`,
    UserActionsQuery: `comment(projectId:String!): Comment
                        messages: [Message]
                        search(filter: String):Search`
}