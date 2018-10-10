import os


def config():
    return {
        'ENABLED': bool(os.getenv('EMAIL_SENDING_ENABLED', 'False').lower() in ['true', 1]),
        'SMTP_SERVER_PORT': int(os.getenv('SMTP_SERVER_PORT', 25)),
        'SMTP_SERVER_HOST': os.getenv('SMTP_SERVER_HOST', 'localhost'),
        'FROM_ADDRESS': os.getenv('EMAIL_FROM_ADDRESS', 'unconfigured')
    }
