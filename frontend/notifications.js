const amqp = require('amqp');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const vhost = process.env.RABBITMQ_VHOST || '/';

const user = process.env.RABBITMQ_USER || 'guest';
const password = process.env.RABBITMQ_PASSWORD || 'guest';
const amqpHost = process.env.RABBITMQ_HOST || 'localhost';
const amqpPort = process.env.RABBITMQ_PORT || 5672;
const jwksURI = process.env.KEYCLOAK_CERTS_URL || null;

let client = jwksClient({jwksUri:jwksURI});

function getSigningKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback({error: 'certificate download failed'}, null);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const setup = (io) => {

  if (!jwksURI) {
    console.log('No KEYCLOAK_CERTS_URL in environment,' +
      ' cannot validate tokens and will not serve socket.io clients');
    return;
  }


  io.on('connect', (socket) => {
    socket.join('global');
    let authenticated = false;
    let roomName;

    socket.on('action', function (action) {

        switch (action.type) {
          case 'socketio/AUTHENTICATE':
            jwt.verify(action.token, getSigningKey, {}, (err, decoded) => {
              if (err) {
                console.log(`error verifying token ${err}`);
                authenticated = false;
              } else {
                roomName = `user_${decoded.user_id}`;
                socket.join(roomName);
                authenticated = true;
              }
            });
            break;
          case 'socketio/DEAUTHENTICATE':
            authenticated = false;
            if (authenticated) {
              socket.leave(roomName)
            }
            break;
          default:
            console.log('unknown action received ' + action.type);
        }
      }
    );

  });

  connect(io);
};

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

        //by default our audience is everyone
        let room = 'global';

        if (message.audience && message.audience !== 'global') {
          //this message is for someone in particular
          room = `user_${message.audience}`;
        }

        if (!message.type) {
          console.log('this message does not contain a type!');
          return;
        }

        switch(message.type) {
          case 'notification':
            io.in(room).emit('action', {
              type: 'SERVER_INITIATED_NOTIFICATION_RELOAD',
              message: 'notification'
            });
            break;
          default:
            console.log(`unknown message type ${message.type}`);
        }
      });
    });
  });
};

module.exports = {
  setup
};
