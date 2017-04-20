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


class usersBulkPost(APIView):
  """  
  Adds a number of users  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, items):
    return Response()

class usersGet(APIView):
  """  
  Returns all users  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, ):
    return Response()

class usersIdDeletePost(APIView):
  """  
  Deletes a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id):
    return Response()

class usersIdFavouritesGet(APIView):
  """  
  Returns the favourites for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class usersIdFavouritesPost(APIView):
  """  
  Adds favourites to a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()

class usersIdFavouritesPut(APIView):
  """  
  Updates the favourites for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()

class usersIdGet(APIView):
  """  
  Returns data for a particular user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class usersIdGroupsGet(APIView):
  """  
  Returns all groups that a user is a member of  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class usersIdGroupsPost(APIView):
  """  
  Add to the active set of groups for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()

class usersIdGroupsPut(APIView):
  """  
  Updates the active set of groups for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()

class usersIdNotificationsGet(APIView):
  """  
  Returns a user's notifications  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class usersIdPermissionsGet(APIView):
  """  
  Returns the set of permissions for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class usersIdPut(APIView):
  """  
    
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, item):
    return Response()

class usersIdRolesGet(APIView):
  """  
  Returns the roles for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()

class usersIdRolesPost(APIView):
  """  
  Adds a role to a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()

class usersIdRolesPut(APIView):
  """  
  Updates the roles for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()

class usersPost(APIView):
  """  
  Create new user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, item):
    return Response()

class usersSearchGet(APIView):
  """  
  Searches Users  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, fuelSuppliers = None, surname = None, includeInactive = None):
    return Response()


