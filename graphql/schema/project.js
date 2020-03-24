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
<<<<<<< Updated upstream
=======
                community: [String]
                adopters: [Organization]
                likes: [User]
>>>>>>> Stashed changes
                slug: String!
                createdAt: String!
                commits: [Commit]
                issues: [Issue]
                comments: [Comment]
            }
            type Organization {
                _id: ID!
                name: String!
                website: String!
                icon: [String]
                projects: [Project]
                adopted: [Project]
            }

            input OrgInput {
                name: String!
                website: String!
                icon: [String]
                projects: [String]
                adopted: [String]
            }

            type Commit {
                _id: ID
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
<<<<<<< Updated upstream
                tag: [String!]                     
                orgination: String
=======
                tag: [String!]
>>>>>>> Stashed changes
                createdAt: String!
                category: String!

            }
            input UpdateProject {
                projectId: String!
                community: [String]                    
                orgination: [String]
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
<<<<<<< Updated upstream
                        updateIssue(updateIssueInput: UpdateIssueInput): Issue`,
=======
                        updateIssue(updateIssueInput: UpdateIssueInput): Issue
                        addLikes(projectId: String): Project
                        dislike(projectId: String): Project
                         `,
>>>>>>> Stashed changes
    ProjectQuery : `projects(projectFilter: ProjectFilter): [Project!]!
                    commits: [Commit!]!
                    issue(tag:[String]): [Issue!]!`
};