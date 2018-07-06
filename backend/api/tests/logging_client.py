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

import logging
import inspect

from django.test import Client


class ClientLoggingMetaclass(type):
    """A metaclass for adding functionality to Django Client test utility"""

    wrapped_calls = ['get', 'post', 'put', 'patch', 'delete', 'head']

    def __new__(mcs, name, bases, dictionary):
        """Wrap parent calls with interceptor"""

        for base in bases:
            for key, value in base.__dict__.items():
                if hasattr(value, "__call__") and key in ClientLoggingMetaclass.wrapped_calls:
                    dictionary[key] = ClientLoggingMetaclass.wrap_call(key, value)

        return type.__new__(mcs, name, bases, dictionary)

    @classmethod
    def wrap_call(mcs, name, method):
        """Wrap calls to targeted functions"""

        # logging.debug("wrapping calls to {}".format(name))

        data_param = None
        path_param = None

        for index, param in enumerate(inspect.signature(method).parameters.values()):
            if param.name == "data":
                data_param = (index, param)
            if param.name == "path":
                path_param = (index, param)

        def call(*args, **kw):
            """Delegate to target, but log HTTP request and response attributes"""
            results = method(*args, **kw)
            try:
                data = 'N/A'
                if data_param is not None and data_param[1] is not None:
                    if data_param[1].kind == inspect.Parameter.POSITIONAL_ONLY:
                        data = args[data_param[0]]
                    else:
                        data = kw[data_param[1].name] if data_param[1].name in kw else 'N/A'

                logging.debug(
                    '--------\n'
                    'network exchange details:\n'
                    '--------\n'
                    '{} request for {}\n'
                    '--request payload--\n{}\n'
                    '--response status {}--\n'
                    '--response body--\n{}\n'
                    '--------\n'.format(
                        name,
                        args[path_param[0]] if path_param is not None else 'N/A',
                        data,
                        results.status_code,
                        results.content.decode('utf-8')
                    ))
            except (KeyError, AttributeError):
                logging.error('unexpected error while wrapping network request call')

            return results

        return call


class LoggingClient(Client, metaclass=ClientLoggingMetaclass):
    """A Client that logs network exchanges. Drop-in descendant of django.test.client"""
    pass
