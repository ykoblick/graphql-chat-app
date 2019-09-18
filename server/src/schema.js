// server/src/schema.js

/*

We start by defining a simple Chat type, which has three fields: the chat ID, the username of the user sending the message and the message itself. Then we define a query to fetch all messages and a mutation for sending a new message, which accepts the username and the message. Lastly, we define a subscription, which we are calling messageSent and it will return a message.

*/
const typeDefs = `
  
  type Chat {
    id: Int!
    from: String!
    message: String!
  }

  type Query {
    chats: [Chat]
  }

  type Mutation {
    sendMessage(from: String!, message: String!): Chat
  }

  type Subscription {
    messageSent: Chat
  }
`
module.exports = typeDefs