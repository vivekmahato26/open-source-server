import { makeExecutableSchema } from 'graphql-tools';
import Base from './base';
import User from './user/schema';
import Message from './message/schema';
import Project from './project/schema';
import Comment from './comment/schema';
import Commit from './commit/schema';
import Issue from './issue/schema';
import Organization from './organization/schema';
import resolvers from './resolver';

export default makeExecutableSchema({
    typeDefs: [Base, User, Message, Project, Comment, Commit, Issue, Organization],
    resolvers,
    logger: { log: e => console.log(e) },
});