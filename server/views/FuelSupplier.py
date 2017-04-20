"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions 


class fuelsuppliersBulkPost(APIView):
  """  
  Bulk create / update a number of FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, items):
    return Response()

class fuelsuppliersGet(APIView):
  """  
  Lists available FuelSupplier objects  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, ):
    return Response()

class fuelsuppliersIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class fuelsuppliersIdDeletePost(APIView):
  """  
  Deletes a specific FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id):
    return Response()

class fuelsuppliersIdGet(APIView):
  """  
  Gets a specific FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class fuelsuppliersIdHistoryGet(APIView):
  """  
  Returns History for a particular FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id, offset = None, limit = None):
    return Response()

class fuelsuppliersIdHistoryPost(APIView):
  """  
  Add a History record to the FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()

class fuelsuppliersIdNotesGet(APIView):
  """  
  Returns notes for a particular FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class fuelsuppliersIdPut(APIView):
  """  
  Updates a specific FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, item):
    return Response()

class fuelsuppliersPost(APIView):
  """  
  Creates a new FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, item):
    return Response()

class fuelsuppliersSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, fuelSupplierName = None, includeInactive = None):
    return Response()


