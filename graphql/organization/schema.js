import Base from '../base';
import Project from '../project/schema';

const Organization = `
    type Organization {
        _id: ID!
        name: String!
        logo: String
        website: String
        icon: [String]
        projects: [Project]
        adopted: [Project]
        createdAt: String!
        updatedAt: String!
    }

    input OrgInput {
        logo: String
        name: String!
        website: String!
        icon: [String]
    }

    
    extend type Mutation {
        addOrganization(orgInput: OrgInput): Organization 
    }        

    extend type Query {
        orgSearch(filter:String!):[Organization]
    }
        
`;

export default () => [Organization, Project, Base];