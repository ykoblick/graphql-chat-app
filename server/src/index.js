   // server/src/index.js

   const { GraphQLServer, PubSub } = require('graphql-yoga')
   const mongoose = require('mongoose')
   
   const typeDefs = require('./schema')
   const resolvers = require('./resolver')

   const pubsub = new PubSub()
   const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

   // mongoose.connect('mongodb+srv://ykoblick:ykoblick!@tribex1-yhktk.mongodb.net/test-chat', {
   //    useNewUrlParser: true,
   //    useFindAndModify: false,
   //    useCreateIndex: true
   //  });

  //  var kue = require('kue')

  //  var jobs = kue.createQueue({
  //      prefix: 'jobs',
  //      redis: {
  //        //port: 1234,
  //        host: 'shabbat.redis.cache.windows.net',
  //        auth: ',abortConnect=false,ssl=true,password=rVlKMguqdjPHdgsnQMlw0KDTAB9AvaTn5jMvdCHoeyE=',
  //        //db: 3, // if provided select a non-default redis db
  //        options: {
  //          // see https://github.com/mranney/node_redis#rediscreateclient
  //        }
  //      }
  //    });



   server.start(() => console.log('Server is running on localhost:4000'))