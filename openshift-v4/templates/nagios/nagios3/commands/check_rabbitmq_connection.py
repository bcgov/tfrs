import os
import pika
from pika import ConnectionParameters, PlainCredentials
from pika.exceptions import AMQPError

AMQP = {
   'ENGINE': 'rabbitmq',
   'VHOST': os.getenv('AMQP_VHOST', '/'),
   'USER': os.getenv('AMQP_USER', 'guest'),
   'PASSWORD': os.getenv('AMQP_PASSWORD', 'guest'),
   'HOST': os.getenv('AMQP_HOST', 'localhost'),
   'PORT': os.getenv('AMQP_PORT', '5672')
}

AMQP_CONNECTION_PARAMETERS = ConnectionParameters(
    host=AMQP['HOST'],
    port=AMQP['PORT'],
    virtual_host=AMQP['VHOST'],
    credentials=PlainCredentials(AMQP['USER'], AMQP['PASSWORD'])
)

try:
    parameters = AMQP_CONNECTION_PARAMETERS
    connection = pika.BlockingConnection(parameters)
    connection.channel()
    connection.close()
    print('OK - Rabbitmq connection checking passed')
except AMQPError as _error:
    print('CRITICAL - Rabbitmq connection checking failed')