const amqp = require('amqp');

const connect = function (io) {
  const connection = amqp.createConnection({ host: 'localhost' });

  connection.on('error', (e) => {
    console.log('AMQP error: ', e);
  });

  connection.on('ready', () => {
    console.log('AMQP connection ready');

    connection.queue('', { exclusive: true, autoDelete: true }, (q) => {
      q.bind('notifications', '#');

      /* we got a notification -- tell the connected clients */
      q.subscribe((message) => {
        io.in('global').emit('action', {
          type: 'SERVER_INITIATED_NOTIFICATION_RELOAD',
          message: 'notification'
        });
      });
    });
  });
};

module.exports = {
  connect
};
