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
import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions 
from rest_framework import mixins
from rest_framework import generics
from rest_framework_bulk import BulkCreateModelMixin
from . import serializers
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CreditTradeZeroReason import CreditTradeZeroReason
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.Organization import Organization
from .models.OrganizationActionsType import OrganizationActionsType
from .models.OrganizationAttachment import OrganizationAttachment
from .models.OrganizationBalance import OrganizationBalance
from .models.OrganizationHistory import OrganizationHistory
from .models.OrganizationStatus import OrganizationStatus
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel


# Custom views.  This file is hand edited.

class credittradesSearchGet(APIView):
  """  
  Searches credit trades  
  """
  def get(self, request, organization = None, tradeType = None, status = None, dateType = None, startDate = None, expiration_date = None):
    result = CreditTrade.objects.all()
    if organization != None:
       result = result.filter(organization__icontains = organization)
    if status != None:
       result = result.filter(status__icontains = status)
    if dateType != None:
       result = result.filter(dateType = dateType)
    if startDate != None:
        result = result.filter(tradeExecutionDate__gt = startDate, tradeExecutionDate__lt = expiration_date)
    if expiration_date != None:
        result = result.filter(tradeExecutionDate__lt = expiration_date)

    serializer = serializers.CreditTradeSerializer(result, many=True)
    return Response(serializer.data)

class usersCurrentGet(APIView):
  """  
  Get the currently logged in user  
  """
  def get(self, request, ):
    currentUser = User.objects.all()[0] # replace with current user
    serializer = serializers.UserSerializer(currentUser)
    return Response(serializer.data)

class organizationsIdAttachmentsGet(mixins.CreateModelMixin, APIView):
  """  
  Returns attachments for a particular Organization
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)
  queryset = OrganizationHistory.objects.all()
  serializer_class = serializers.OrganizationHistorySerializer

  def get(self, request, id):
    """
    Returns attachments for a particular Fuel Supplier
    """
    organization = Organization.objects.get(id=id)
    serializer = AttachmentSerializer(Organization.attachments, many=True)
    return Response(serializer.data)

  def post(self, request, id):
    """
    Accepts a new file upload.
    """
    jsonString = self.request.POST['item']
    data = json.loads(jsonString)
    file_name = request.FILES['file'].name
    # TODO: save file to disk
    fileData = request.FILES['file'].read()
    organization = Organization.objects.get(id=id)
    # TODO: remove hard coded file_location string an replace with real
    attachment = OrganizationAttachment(
      organization=organization,
      file_name=file_name,
      file_location='file_location',
      description=data['description'],
      compliance_year=data.get('compliance_year'))
    attachment.save()
    serializer = serializers.OrganizationAttachmentSerializer(attachment)
    return Response(serializer.data)

class organizationsIdHistoryGet(APIView):
  """  
  Returns History for a particular Organization
  """
  def get(self, request, id, offset = None, limit = None):
    organization = Organization.objects.get(id=id)
    serializer = serializers.OrganizationHistorySerializer(organization.history, many=true)
    return Response(serializer.data)

  def post(self, request, id):
    """
    Add a History record to the Organization
    """
    organization = Organization.objects.get(id=id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    history = OrganizationHistory(organization_id=id, history_text=data['history_text'])
    history.save()
    serializer = serializers.OrganizationHistorySerializer(history)
    return Response(serializer.data)

class organizationsSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """
  def get(self, request, organization_name = None, includeInactive = None):
    result = Organization.objects.all()
    if organization_name != None:
       result = result.filter(name__icontains = organization_name)
    if includeInactive == None or includeInactive == False:
       result = result.filter(status__status__icontains = 'Active')

    serializer = serializers.OrganizationSerializer(result, many=True)
    return Response(serializer.data)

class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """
  def get(self, request, id):
    role = Role.objects.get (id = id)
    rolePermissions = RolePermission.objects.filter(role=role)
    serializer = serializers.RolePermissionSerializer(rolePermissions, many=True)
    return Response(serializer.data)

  def post(self, request, id):
    """
    Adds a permission to a role
    """
    role = Role.objects.get (id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    permission = Permission.objects.get(id=data['permission'])
    rolePermission = RolePermission(role=role, permission=permission)
    rolePermission.save()
    serializer = serializers.RolePermissionSerializer(rolePermission)
    return Response(serializer.data)

  def put(self, request, id):
    """
    Updates the permissions for a role
    """
    role = Role.objects.get (id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    # start by clearing out any existing roles.
    RolePermission.objects.filter(role=role).delete()
    for row in data:
        permission = Permission.objects.get(id=data['permission'])
        rolePermission = RolePermission (permission=permission, role=role)
        rolePermission.save()
    results = RolePermission.objects.filter(role=role)
    serializer = serializers.RolePermissionSerializer(results, many=True)
    return Response(serializer.data)

class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """
  def get(self, request, id):
    role = Role.objects.get (id = id)
    user_roles = UserRole.objects.filter(role = role)
    serializer = serializers.UserRoleSerializer(user_roles)
    return Response(serializer.data)

  def put(self, request, id):
    """
    Updates the users for a role
    """
    role = Role.objects.get (id = id)
    jsonString = request.body.decode('utf-8')
    alldata = json.loads(jsonString)
    # clear existing User Roles.
    UserRole.objects.filter(user=user).delete()

    # add the replacement User Role
    for data in alldata:
      role = Role.objects.get(id = data['role'])
      userRole = UserRole(role = role, user = user)
      userRole.save()
    result = UserRole.objects.filter(user=user)
    serializer = serializers.UserRoleSerializer(result, many=True)
    return Response(serializer.data)

class usersIdPermissionsGet(APIView):

  def get(self, request, id):
    """
    Returns the set of permissions for a user
    """
    user = User.objects.get(id=id)
    user_roles = UserRole.objects.filter(user=user)
    result = []
    for userRole in user_roles:
        rolePermissions = RolePermission.objects.filter(role=userRole.role)
        for rolePermission in rolePermissions:
            result.append (rolePermission.permission)
    serializer = serializers.PermissionSerializer(result, many=True)
    return Response(serializer.data)

class usersIdPermissionsGet(APIView):
  def get(self, request, id):
    """
    Returns the set of permissions for a user
    """
    user = User.objects.get(id=id)
    user_roles = UserRole.objects.filter(user=user)
    result = []
    for userRole in user_roles:
        rolePermissions = RolePermission.objects.filter(role=userRole.role)
        for rolePermission in rolePermissions:
            result.append (rolePermission.permission)
    serializer = serializers.PermissionSerializer(result, many=True)
    return Response(serializer.data)

class usersIdRolesGet(APIView):
  def get(self, request, id):
    """
    Returns all roles that a user is a member of
    """
    result = UserRole.objects.filter(user=id)
    serializer = serializers.UserRoleSerializer(result, many=True)
    return Response(serializer.data)

  def post(self, request, id):
    """
    Adds a user to a role.
    """
    user = User.objects.get(id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    role = Role.objects.get(id = data['role'])
    userRole = UserRole(role = role, user = user)
    userRole.save()
    serializer = serializers.UserRoleSerializer(userRole)
    return Response(serializer.data)

  def put(self, request, id):
    """
    Updates the roles for a user
    """
    user = User.objects.get(id=id)
    jsonString = request.body.decode('utf-8')
    alldata = json.loads(jsonString)
    # clear existing favourites.
    UserRole.objects.filter(user=user).delete()

    # add the replacement User Role
    for data in alldata:
      role = Role.objects.get(id = data['role'])
      userRole = UserRole(role = role, user = user)
      userRole.save()
    result = UserRole.objects.filter(user=user)
    serializer = serializers.UserRoleSerializer(result, many=True)
    return Response(serializer.data)

class usersSearchGet(APIView):
  def get(self, request, organizations = None, surname = None, includeInactive = None):
    """
    Searches Users
    """
    result = User.objects.all()
    if surname != None:
       result = result.filter(surname__icontains = surname)

    serializer = serializers.UserSerializer(result, many=True)
    return Response(serializer.data)
