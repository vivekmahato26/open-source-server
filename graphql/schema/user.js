module.exports = { UserTypes: `
    
    type User {
        _id: ID!
        sname: String!
        email: String!
        password: String!
        name: String
        bio: String
        social: [String]
        owned: [Project]
        contributions: [Project]
        
    }
    input UserLoginInput {
        sname: String!
        email: String!
        password: String!
    }

    input UserInput {
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
    `,
    UserQuery: `login(loginInput:LoginInput!): AuthData!
                user(userId: ID!): User!`,
    UserMutation: `createUser(userLoginInput:UserLoginInput):User
                    updateUser(userInput:UserInput):User`
};

