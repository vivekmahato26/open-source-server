import Base from '../base';
import User from '../user/schema';

const Message =  `
    type Message {
        _id: ID!
        message: String!
        sender: User!
        receiver: [User!]
        createdAt: String!
        updatedAt: String!
    }
    input MessageInput {
        message: String!
        receiver: String!
    }

    extend type Mutation {
        sendMessage(messageInput: MessageInput): Message
    }
                            
    extend type Query {
        messages: [Message]
    }
`;

export default () => [Message, User, Base];