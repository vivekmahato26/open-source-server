import MessageModel from '../../models/message'
import UserModel from '../../models/user'

import {userLoader} from '../populate'

export const Query = {
    messages: async (_, args,req) => {
        try {
          let page = 0;
          let records = 25;
          if (Object.keys(req.query).length !== 0) {
            page = req.query.page;
            records = req.query.records;
          }
          let pagination = {
            page: parseInt(page),
            limit: parseInt(records),
            skip: parseInt(page * records)
          };
          const messages = await MessageModel.find({
            $or: [{ receiver: req.userId }, { sender: req.userId }]
          })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
          return messages;
        } catch (err) {
          throw err;
        }
      }
}

export const Mutation = {
    sendMessage: async (_, args, req) => {
        if (!req.isAuth) {
          throw new Error("User is not authenticated");
        }
        const message = new MessageModel({
          message: args.messageInput.message,
          receiver: args.messageInput.receiver,
          sender: req.userId
        });
        let newMessage;
        try {
          const res = await message.save();
          newMessage = res;
    
          const user = await UserModel.findById(req.userId);
          if (!user) {
            throw new Error("user not found.");
          }
          user.messages.push(message);
          await user.save();
          const receiver = await UserModel.findById(args.messageInput.receiver);
          if (!receiver) {
            throw new Error("user not found.");
          }
          receiver.messages.push(message);
          await receiver.save();
          return newMessage;
        } catch (err) {
          throw err;
        }
      }
}

export const Message = {
    sender: (message) => userLoader.load(message.sender),
    receiver: (message) => userLoader.loadMany(message.receiver)
}
