   // server/src/index.js

   const { GraphQLServer, PubSub } = require('graphql-yoga')
   const mongoose = require('mongoose')
   
   const typeDefs = require('./schema')
   const resolvers = require('./resolver')

   const pubsub = new PubSub()
   const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })


   server.start(() => console.log('Server is running on localhost:4000'))