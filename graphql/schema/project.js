module.exports =  {
    ProjectTypes :`
            type Project {
                _id: ID!
                name: String!
                desc: String
                orgination: String
                admin: User
                tag: [String]
                category: String!
                slug: String!
                createdAt: String!
                commits: [Commit]
                issues: [Issue]
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
                tag: [String!]                     
                orgination: String
                createdAt: String!
                category: String!

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
                        addCommit(commitInput: CommitInput): Commit
                        raiseIssue(issueInput: IssueInput): Issue
                        updateIssue(updateIssueInput: UpdateIssueInput): Issue`,
    ProjectQuery : `projects(projectFilter: ProjectFilter): [Project!]!
                    commits: [Commit!]!
                    issue(tag:[String]): [Issue!]!`
};