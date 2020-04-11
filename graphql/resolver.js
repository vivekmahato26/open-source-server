import {
  Query as UserQuery,
  Mutation as UserMutation,
  User,
  Search
} from './user/resolver'
import {
  Query as MessageQuery,
  Mutation as MessageMutation,
  Message
} from './message/resolver'
import {
  Query as ProjectQuery,
  Mutation as ProjectMutation,
  Project
} from './project/resolver'
import {
  Query as OrganizationQuery,
  Mutation as OrganizationMutation,
  Organization
} from './organization/resolver'
import {
  Query as CommitQuery,
  Mutation as CommitMutation,
  Commit
} from './commit/resolver'
import {
  Query as IssueQuery,
  Mutation as IssueMutation,
  Issue
} from './issue/resolver'
import {
  Query as CommentQuery,
  Mutation as CommentMutation,
  Comment
} from './comment/resolver'

export default {
  Query: {
    ...UserQuery,
    ...MessageQuery,
    ...ProjectQuery,
    ...OrganizationQuery,
    ...CommitQuery,
    ...IssueQuery,
    ...CommentQuery
  },
  Mutation: {
    ...UserMutation,
    ...MessageMutation,
    ...ProjectMutation,
    ...OrganizationMutation,
    ...CommitMutation,
    ...IssueMutation,
    ...CommentMutation
  },
  User,
  Search,
  Message,
  Project,
  Organization,
  Commit,
  Issue,
  Comment
}
