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


class rolesBulkPost(APIView):
  """  
  Bulk create / update a number of RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, items):
    return Response()

class rolesGet(APIView):
  """  
  Lists available RoleViewModel objects  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, ):
    return Response()

class rolesIdDeletePost(APIView):
  """  
  Deletes a specific RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id):
    return Response()

class rolesIdGet(APIView):
  """  
  Gets a specific RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class rolesIdPermissionsPost(APIView):
  """  
  Adds a permissions to a role  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()

class rolesIdPermissionsPut(APIView):
  """  
  Updates the permissions for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()

class rolesIdPut(APIView):
  """  
  Updates a specific RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, item):
    return Response()

class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class rolesIdUsersPut(APIView):
  """  
  Updates the users for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()

class rolesPost(APIView):
  """  
  Creates a new RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, item):
    return Response()


