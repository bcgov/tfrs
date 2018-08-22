const amqp = require('amqp');

const connect = function (io) {
  const connection = amqp.createConnection({host: 'localhost'});

  connection.on('error', (e) => {
    console.log('AMQP error: ', e);
  });

  connection.on('ready', () => {
    console.log('AMQP connection ready');

    connection.queue('', {exclusive: true, autoDelete: true}, (q) => {
      q.bind('tokens', '#');

      q.subscribe((message) => {
        console.log(message);
      });
    });

    connection.queue('', {exclusive: true, autoDelete: true}, (q) => {
      q.bind('notifications', '#');

      q.subscribe((message) => {
        io.in('global').emit('action', { type: 'server_notify', message: message.message });
      });
    });
  });

};

module.exports = {
  connect
};
