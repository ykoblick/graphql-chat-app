// server/src/resolver.js
var kue = require('kue')
   


const chats = []
const CHAT_CHANNEL = 'CHAT_CHANNEL'

const resolvers = {

  Query: {

    chats(root, args, context) {

      //Get the chat conversation from mongo

      return chats
    }

  },

  Mutation: {

    sendMessage(root, { from, message }, { pubsub }) {

      const chat = {
        id: chats.length + 1,
        from,
        message
      }

      // setInterval(function (){
      //   newJob('Send_Email', chat);
      // }, 100);

   
      var jobs = kue.createQueue({
        prefix: 'jobs',
        redis: {
          port: 6379,
          host: '127.0.0.1'
        }
      });
      
      newJob('Send_Email', chat);


      function newJob (name, chat){
        name = name || 'Default_Name';
        var job = jobs.create('new job', {
          name: name,
          chat: chat
        });

      
        job
          .on('complete', function (){
            console.log('Job', job.id, 'with name', job.data.name, 'is done');
      
            chats.push(job.data.chat);

            pubsub.publish('CHAT_CHANNEL', { messageSent: job.data.chat })

          })
          .on('failed', function (){
            console.log('Job', job.id, 'with name', job.data.name, 'has failed');
          })
      
        job.save();
      }
      
      jobs.process('new job', function (job, done){
        /* carry out all the job function here */
        console.log('processing job here - persist to mongo, update cache, send email/push');
        done && done();
      });
      
      return chat

    }
  },

  Subscription: {
    
    messageSent: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(CHAT_CHANNEL)
      }

    }
  }

}

module.exports = resolvers