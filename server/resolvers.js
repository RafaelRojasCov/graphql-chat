const { PubSub } = require("apollo-server-express");
const db = require("./db");

const pubSub = new PubSub();

//event labels
const MESSAGE_ADDED = "MESSAGE_ADDED";

function requireAuth(userId) {
  if (!userId) {
    throw new Error("Unauthorized");
  }
}

const Query = {
  messages: (_root, _args, { userId }) => {
    requireAuth(userId);
    return db.messages.list();
  },
};

const Mutation = {
  addMessage: (_root, { input }, { userId }) => {
    requireAuth(userId);
    const messageId = db.messages.create({ from: userId, text: input.text });
    const messageAdded = db.messages.get(messageId);
    pubSub.publish(MESSAGE_ADDED, {
      messageAdded,
    });

    return messageAdded;
  },
};

const Subscription = {
  messageAdded: {
    subscribe: () => pubSub.asyncIterator([MESSAGE_ADDED]),
  },
};

module.exports = { Query, Mutation, Subscription };
