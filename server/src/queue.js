var kue = require('kue')

var jobs = kue.createQueue({
    prefix: 'jobs',
    redis: {
      //port: 1234,
      host: 'shabbat.redis.cache.windows.net',
      auth: 'rVlKMguqdjPHdgsnQMlw0KDTAB9AvaTn5jMvdCHoeyE=',
      //db: 3, // if provided select a non-default redis db
      options: {
        // see https://github.com/mranney/node_redis#rediscreateclient
      }
    }
  });




function newJob (name){
  name = name || 'Default_Name';
  var job = jobs.create('new job', {
    name: name
  });

  job
    .on('complete', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'is done');

      //pubsub.publish('CHAT_CHANNEL', { messageSent: chat })

    })
    .on('failed', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'has failed');
    })

  job.save();
}

jobs.process('new job', function (job, done){
  /* carry out all the job function here */
  done && done();
});
