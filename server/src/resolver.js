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

    //Send Message called when sending a message
    sendMessage(root, { from, message }, { pubsub }) {

      //Chat message object
      const chat = {
        id: chats.length + 1,
        from,
        message
      }

      //Create a queue called jobs
      var jobs = kue.createQueue({
        prefix: 'jobs',
        redis: {
          port: 6379,
          host: '127.0.0.1'
        }
      });

      //Add the chat object to the queue to be processed
      newJob('Process_New_Message_For_Delivery', chat);

      //The function to handle the queing of the incoming chat
      function newJob(name, chat) {

        //Create the job passing in the job name and the chat/message
        var job = jobs.create('new job', {
          name: name,
          chat: chat
        });

        //When the job completes -> push the chat into the array, but most 
        //importantly -> publish it to the channel
        job
          .on('complete', function () {

            console.log('Job', job.id, 'with name', job.data.name, 'is done');

            chats.push(job.data.chat);

            pubsub.publish('CHAT_CHANNEL', { messageSent: job.data.chat })

          })
          .on('failed', function () {
            console.log('Job', job.id, 'with name', job.data.name, 'has failed');
          })

        job.save();
      }

      //When the job is popped of the queue -> process
      jobs.process('new job', function (job, done) {
      
        console.log('processing new incoming message:');

        //Simpulate some latency ie the job is processing
        setTimeout(function () {

          console.log('persisted to mongo, updated cache, sent async to microservice for email/push');

          //(not sure what's being called here)
          done && done();

        }, 3000);

        
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