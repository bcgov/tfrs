import os


def config():
    return {
        'ENGINE': 'rabbitmq',
        'VHOST': os.getenv('RABBITMQ_VHOST', '/'),
        'USER': os.getenv('RABBITMQ_USER', 'guest'),
        'PASSWORD': os.getenv('RABBITMQ_PASSWORD', 'guest'),
        'HOST': os.getenv('RABBITMQ_HOST', 'localhost'),
        'PORT': os.getenv('RABBITMQ_PORT', '5672'),
    }
