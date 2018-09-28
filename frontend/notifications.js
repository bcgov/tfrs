const amqp = require('amqp');

const vhost = process.env.RABBITMQ_VHOST || '/';

const user = process.env.RABBITMQ_USER || 'guest';
const password = process.env.RABBITMQ_PASSWORD || 'guest';
const amqpHost = process.env.RABBITMQ_HOST || 'localhost';
const amqpPort = process.env.RABBITMQ_PORT || 5672;

const connect = (io) => {
  const connection = amqp.createConnection({
    host: amqpHost,
    port: amqpPort,
    vhost,
    login: user,
    password
  });

  connection.on('error', (e) => {
    console.log('AMQP error: ', e);
  });

  connection.on('ready', () => {
    console.log('AMQP connection ready');

    connection.queue('', { exclusive: false, autoDelete: true }, (q) => {
      connection.exchange('notifications', {
        type: 'fanout',
        autoDelete: false,
        durable: true,
        confirm: false
      }, (exchange) => {
        q.bind(exchange, '#');
      });

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
