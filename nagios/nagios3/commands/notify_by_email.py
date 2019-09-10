import os
import sys
from email.message import EmailMessage
import smtplib

# sys.argv[1] is subject
# sys.argv[2] is email body
# sys.argv[3] is receiver email address(es)

EMAIL = {
    'SMTP_SERVER_HOST': os.getenv('SMTP_SERVER_HOST', 'apps.smtp.gov.bc.ca'),
    'SMTP_SERVER_PORT': int(os.getenv('SMTP_SERVER_PORT', 25))
}

msg = EmailMessage()
msg.set_content(sys.argv[2])

msg['Subject'] = sys.argv[1]
msg['From'] = "noreply@gov.bc.ca"
msg['To'] = sys.argv[3]

with smtplib.SMTP(host=EMAIL['SMTP_SERVER_HOST'],
                    port=EMAIL['SMTP_SERVER_PORT']) as server:
    try:
        server.send_message(msg)
        print('OK - Email sending succeed')
    except Exception as error:
        print('CRITICAL - Email sending failed')