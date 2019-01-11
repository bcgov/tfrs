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
from tfrs.settings import AMQP_CONNECTION_PARAMETERS


class SecurityScan:

    @staticmethod
    def handle_scan_response(body):
        response = json.loads(body)
        id = response['id']
        scan_complete = response['scanComplete']
        scan_passed = response['scanPassed']
        attachment = DocumentFileAttachment.objects.get(id=id)
        if scan_complete:
            if scan_passed:
                attachment.security_scan_status = 'PASS'
            else:
                attachment.security_scan_status = 'FAIL'

        attachment.update_timestamp = datetime.now()
        attachment.save()

    @staticmethod
    def send_scan_request(file: DocumentFileAttachment):
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
