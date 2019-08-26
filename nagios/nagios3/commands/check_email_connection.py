import os

import smtplib

EMAIL = {
    'SMTP_SERVER_HOST': os.getenv('SMTP_SERVER_HOST', 'apps.smtp.gov.bc.ca'),
    'SMTP_SERVER_PORT': int(os.getenv('SMTP_SERVER_PORT', 25))
}

try:
    with smtplib.SMTP(host=EMAIL['SMTP_SERVER_HOST'],
                        port=EMAIL['SMTP_SERVER_PORT']) as server:
        server.noop()
    print('OK - Email connection checking passed')
except Exception as error:
    print('CRITICAL - Email connection checking failed')
