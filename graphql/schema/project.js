module.exports =  {
    ProjectTypes :`
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
                createdAt: String!
                commits: [Commit]
                issues: [Issue]
                comments: [Comment]
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
            type Organization {
                _id: ID!
                name: String!
                website: String
                icon: [String]
                projects: [Project]
                adopted: [Project]
            }

            input OrgInput {
                name: String!
                website: String!
                icon: [String]
            }

            type Commit {
                _id: ID!
                commiter: String!
                message: String!
                link: String!
                slug: String!
                project: Project!
                createdAt: String!
            }
            
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
            }

            input ProjectInput {
                name: String!
                desc: String!
                slug: String!
                organization: String
                tag: [String!]
                createdAt: String!
                category: String!

            }
            input UpdateProject {
                projectId: String!
                community: CommunityInput
                adopter:[String]
            }

            input CommitInput {
                commiter: String!
                message: String!
                projectId: String!
                slug: String!
                link: String!
                createdAt: String!
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
            input ProjectFilter{
                userId: String
                tag: [String]
                category: String
            }
        `,
    ProjectMutation: `addProject(projectInput: ProjectInput): Project
                        updateProject(updateInput: UpdateProject): Project
                        addCommit(commitInput: CommitInput): Commit
                        raiseIssue(issueInput: IssueInput): Issue
                        updateIssue(updateIssueInput: UpdateIssueInput): Issue
                        addLikes(projectId: String): Project
                        dislike(projectId: String): Project
                        addOrganization(orgInput: OrgInput): Organization `,
    ProjectQuery : `projects(projectFilter: ProjectFilter): [Project!]!
                    commits: [Commit!]!
                    issue(tag:[String]): [Issue!]!
                    orgSearch(filter:String!):[Organization]`
};