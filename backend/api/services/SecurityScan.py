"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1


    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""
import json
from datetime import datetime

import pika
from pika.exceptions import AMQPError

from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentStatus import DocumentStatus
from api.notifications.notification_types import NotificationType
from api.notifications.notifications import AMQPNotificationService
from tfrs.settings import AMQP_CONNECTION_PARAMETERS


class SecurityScan:
    """
    Class to update and send notifications for the file attachments
    """
    @staticmethod
    def update_status_and_send_notifications(attachment):
        """Update document status and send notifications is it is required"""

        not_run_files = DocumentFileAttachment.objects.filter(
            document=attachment.document,
            security_scan_status='NOT RUN'
        )
        in_progress_files = DocumentFileAttachment.objects.filter(
            document=attachment.document,
            security_scan_status='IN PROGRESS'
        )
        failed_files = DocumentFileAttachment.objects.filter(
            document=attachment.document,
            security_scan_status='FAIL'
        )

        if len(not_run_files) > 0 or len(in_progress_files) > 0:
            # The verdict is not in yet
            return

        user = attachment.document.update_user
        if user is None:
            user = attachment.document.create_user

        if len(failed_files) > 0:
            attachment.document.status = DocumentStatus.objects.get(
                status='Security Scan Failed')
            attachment.document.save()

            AMQPNotificationService.send_notification(
                interested_organization=user.organization,
                message=NotificationType.DOCUMENT_SCAN_FAILED.name,
                notification_type=NotificationType.DOCUMENT_SCAN_FAILED,
                originating_user=user,
                related_document=attachment.document
            )
            return
        else:
            AMQPNotificationService.send_notification(
                interested_organization=user.organization,
                message=NotificationType.DOCUMENT_SUBMITTED.name,
                notification_type=NotificationType.DOCUMENT_SUBMITTED,
                originating_user=user,
                related_document=attachment.document
            )

            submitted_status = DocumentStatus.objects.get(status='Submitted')
            attachment.document.status = submitted_status

            attachment.document.save()

    @staticmethod
    def handle_scan_response(body):
        """
        Method to parse the response from the scan and update the status
        accordingly
        """
        response = json.loads(body)
        file_id = response['id']
        scan_complete = response['scanComplete']
        scan_passed = response['scanPassed']
        attachment = DocumentFileAttachment.objects.get(id=file_id)
        if scan_complete:
            if scan_passed:
                attachment.security_scan_status = 'PASS'
            else:
                attachment.security_scan_status = 'FAIL'

        attachment.update_timestamp = datetime.now()
        attachment.save()
        SecurityScan.update_status_and_send_notifications(attachment)

    @staticmethod
    def send_scan_request(file: DocumentFileAttachment):
        """
        Method to send the request for scanning the files
        """
        try:
            parameters = AMQP_CONNECTION_PARAMETERS
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            channel.confirm_delivery()
            channel.queue_declare(queue='security-scan-requests')

            channel.basic_publish(exchange='',
                                  routing_key='security-scan-requests',
                                  body=json.dumps({
                                      'message': 'scan-request',
                                      'url': file.url,
                                      'id': file.id,
                                      'filename': file.filename
                                  }),
                                  properties=pika.BasicProperties(
                                      content_type='application/json',
                                      delivery_mode=1
                                  ),
                                  mandatory=True)

            channel.close()
            connection.close()

        except AMQPError as error:
            print('AMQP Error {}'.format(error))
