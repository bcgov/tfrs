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
from .models.Audit import Audit
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.FuelSupplier import FuelSupplier
from .models.FuelSupplierActionsType import FuelSupplierActionsType
from .models.FuelSupplierAttachment import FuelSupplierAttachment
from .models.FuelSupplierAttachmentTag import FuelSupplierAttachmentTag
from .models.FuelSupplierBalance import FuelSupplierBalance
from .models.FuelSupplierCCData import FuelSupplierCCData
from .models.FuelSupplierContact import FuelSupplierContact
from .models.FuelSupplierContactRole import FuelSupplierContactRole
from .models.FuelSupplierHistory import FuelSupplierHistory
from .models.FuelSupplierStatus import FuelSupplierStatus
from .models.FuelSupplierType import FuelSupplierType
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationType import NotificationType
from .models.NotificationViewModel import NotificationViewModel
from .models.Opportunity import Opportunity
from .models.OpportunityHistory import OpportunityHistory
from .models.OpportunityStatus import OpportunityStatus
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserFavourite import UserFavourite
from .models.UserFavouriteViewModel import UserFavouriteViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel


# Custom views.  This file is hand edited.

class credittradesSearchGet(APIView):
  """  
  Searches credit trades  
  """  
  def get(self, request, organization = None, tradeType = None, status = None, dateType = None, startDate = None, endDate = None):
    result = CreditTrade.objects.all()
    if organization != None:
       result = result.filter(organization__icontains = organization)
    if status != None:
       result = result.filter(status__icontains = status)
    if dateType != None:
       result = result.filter(dateType = dateType)
    if startDate != None:
        result = result.filter(tradeExecutionDate__gt = startDate, tradeExecutionDate__lt = endDate)
    if endDate != None:
        result = result.filter(tradeExecutionDate__lt = endDate)
       
    serializer = serializers.CreditTradeSerializer(result, many=True)
    return Response(serializer.data)    

class usersCurrentFavouritesIdDeletePost(APIView):
  """  
  Removes a specific user favourite  
  """  
  def post(self, request, id):
    userFavourite = UserFavourite.objects.get(id=id)
    userFavourite.delete()
    serializer = serializers.UserFavouriteSerializer(userFavourite)
    return Response(serializer.data)

class usersCurrentFavouritesPut(APIView):
  """  
  Create new favourite for the current user  
  """
  def post(self, request):    
    user = User.objects.all()[0] # replace with getcurrentuserid    
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    userFavourite = UserFavourite(name = data['name'], value = data['value'], isDefault = data['isDefault'], userId = user)
    userFavourite.save()
    serializer = serializers.UserFavouriteSerializer(userFavourite)
    return Response(serializer.data)  

  def put(self, request):
    user = User.objects.all()[0] # replace with getcurrentuserid    
    jsonString = request.body.decode('utf-8')
    alldata = json.loads(jsonString)
    # clear existing favourites.
    UserFavourite.objects.filter(userId=user).delete()

    # add the replacement favourites
    for data in alldata:
      userFavourite = UserFavourite(name = data['name'], value = data['value'], isDefault = data['isDefault'], userId = user)
      userFavourite.save()
    result = UserFavourite.objects.filter(userId=user)
    serializer = serializers.UserFavouriteSerializer(result, many=True)
    return Response(serializer.data)  

class usersCurrentFavouritesSearchGet(APIView):
  """  
  Returns a user's favourites of a given type.   
  """       
  def get(self, request):
    currentUser = User.objects.all()[0] # replace with current user
    type = request.GET.get('type', None)
    userFavourites = UserFavourite.objects.filter(userId = currentUser)
    if type != None:
        userFavourites = userFavourites.filter(type = type)

    serializer = serializers.UserFavouriteSerializer(userFavourites, many=True)
    return Response(serializer.data)

class usersCurrentGet(APIView):
  """  
  Get the currently logged in user  
  """        
  def get(self, request, ):
    currentUser = User.objects.all()[0] # replace with current user
    serializer = serializers.UserSerializer(currentUser)
    return Response(serializer.data)

class fuelsuppliersIdAttachmentsGet(mixins.CreateModelMixin, APIView):
  """  
  Returns attachments for a particular FuelSupplier  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierHistory.objects.all()  
  serializer_class = serializers.FuelSupplierHistorySerializer

  def get(self, request, id):
    """  
    Returns attachments for a particular Fuel Supplier  
    """
    fuelSupplier = FuelSupplier.objects.get(id=id)    
    serializer = AttachmentSerializer(fuelSupplier.attachments, many=True)
    return Response(serializer.data)

  def post(self, request, id):
    """  
    Accepts a new file upload.  
    """    
    jsonString = self.request.POST['item']
    data = json.loads(jsonString)
    fileName = request.FILES['file'].name
    # TODO: save file to disk
    fileData = request.FILES['file'].read()
    fuelSupplier = FuelSupplier.objects.get(id=id)   
    # TODO: remove hard coded fileLocation string an replace with real
    attachment = FuelSupplierAttachment(
      fuelSupplierId=fuelSupplier,
      fileName=fileName,
      fileLocation='fileLocation',
      description=data['description'],
      complianceYear=data.get('complianceYear'))
    attachment.save()
    serializer = serializers.FuelSupplierAttachmentSerializer(attachment)
    return Response(serializer.data)

class fuelsuppliersIdHistoryGet(APIView):
  """  
  Returns History for a particular FuelSupplier  
  """    
  def get(self, request, id, offset = None, limit = None):
    fuelSupplier = FuelSupplier.objects.get(id=id)
    serializer = serializers.FuelSupplierHistorySerializer(fuelSupplier.history, many=true)
    return Response(serializer.data)

  def post(self, request, id):
    """  
    Add a History record to the FuelSupplier  
    """
    fuelSupplier = FuelSupplier.objects.get(id=id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    history = FuelSupplierHistory(fuelSupplierId_id=id, historyText=data['historyText'])
    history.save()
    serializer = serializers.FuelSupplierHistorySerializer(history)
    return Response(serializer.data)  

class fuelsuppliersSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """   
  def get(self, request, fuelSupplierName = None, includeInactive = None):
    result = FuelSupplier.objects.all()
    if fuelSupplierName != None:
       result = result.filter(name__icontains = fuelSupplierName)
    if includeInactive == None or includeInactive == False:
       result = result.filter(fuelSupplierStatusId__status__icontains = 'Active')
        
    serializer = serializers.FuelSupplierSerializer(result, many=True)
    return Response(serializer.data)    

class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """         
  def get(self, request, id):
    role = Role.objects.get (id = id)
    rolePermissions = RolePermission.objects.filter(roleId=role)
    serializer = serializers.RolePermissionSerializer(rolePermissions, many=True)
    return Response(serializer.data)
  
  def post(self, request, id):
    """  
    Adds a permission to a role  
    """
    role = Role.objects.get (id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    permission = Permission.objects.get(id=data['permissionId'])
    rolePermission = RolePermission(roleId=role, permissionId=permission)
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
    RolePermission.objects.filter(roleId=role).delete()
    for row in data:
        permission = Permission.objects.get(id=data['permissionId'])
        rolePermission = RolePermission (permissionId=permission, roleId=role)
        rolePermission.save()
    results = RolePermission.objects.filter(roleId=role)
    serializer = serializers.RolePermissionSerializer(results, many=True)
    return Response(serializer.data)    

class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """      
  def get(self, request, id):
    role = Role.objects.get (id = id)   
    userRoles = UserRole.objects.filter(role = role)
    serializer = serializers.UserRoleSerializer(userRoles)
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
      userRole = UserRole(effectiveDate = data['effectiveDate'], expiryDate = data['expiryDate'],role = role, user = user)
      userRole.save()
    result = UserRole.objects.filter(user=user)
    serializer = serializers.UserRoleSerializer(result, many=True)
    return Response(serializer.data)        

class usersIdFavouritesGet(APIView):
  def get(self, request, id):
    """  
    Returns the favourites for a user  
    """
    user = User.objects.get(id=id)
    result = UserFavourite.objects.filter(userId=user)
    serializer = serializers.UserFavouriteSerializer(result, many=True)
    return Response(serializer.data)

  def post(self, request, id):    
    """  
    Adds favourites to a user  
    """  
    user = User.objects.get(id=id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    userFavourite = UserFavourite(name = data['name'], value = data['value'], isDefault = data['isDefault'], userId = user)
    userFavourite.save()
    serializer = serializers.UserFavouriteSerializer(userFavourite)
    return Response(serializer.data)  

  def put(self, request, id):
    """  
    Updates the favourites for a user  
    """
    user = User.objects.get(id=id)   
    jsonString = request.body.decode('utf-8')
    alldata = json.loads(jsonString)
    # clear existing favourites.
    UserFavourite.objects.filter(userId=user).delete()

    # add the replacement favourites
    for data in alldata:
      userFavourite = UserFavourite(name = data['name'], value = data['value'], isDefault = data['isDefault'], userId = user)
      userFavourite.save()
    result = UserFavourite.objects.filter(userId=user)
    serializer = serializers.UserFavouriteSerializer(result, many=True)
    return Response(serializer.data)  

class usersIdNotificationsGet(APIView):
  def get(self, request, id):
    """  
    Returns a user's notifications 
    """
    result = Notification.objects.filter(userId_id=id)
    serializer = serializers.NotificationSerializer(result, many=True)
    return Response(serializer.data)
  
  def post(self, request, id):
    """  
    Adds a notification to user 
    """    
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    notification = Notification(
      hasBeenViewed=data['hasBeenViewed'],
      isWatchNotification=data['isWatchNotification'],
      notificationEventId_id=data['notificationEventId'],
      userId_id=id,
    )
    notification.save()
    serializer = serializers.NotificationSerializer(notification)
    return Response(serializer.data)

class usersIdPermissionsGet(APIView):

  def get(self, request, id):
    """  
    Returns the set of permissions for a user  
    """
    user = User.objects.get(id=id)
    userRoles = UserRole.objects.filter(user=user)
    result = []
    for userRole in userRoles:
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
    userRoles = UserRole.objects.filter(user=user)
    result = []
    for userRole in userRoles:
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
    userRole = UserRole(effectiveDate = data['effectiveDate'], expiryDate = data['expiryDate'],role = role, user = user)
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
      userRole = UserRole(effectiveDate = data['effectiveDate'], expiryDate = data['expiryDate'],role = role, user = user)
      userRole.save()
    result = UserRole.objects.filter(user=user)
    serializer = serializers.UserRoleSerializer(result, many=True)
    return Response(serializer.data) 

class usersSearchGet(APIView):
  def get(self, request, fuelSuppliers = None, surname = None, includeInactive = None):
    """  
    Searches Users  
    """   
    result = User.objects.all()
    if fuelSuppliers != None:
       # split on comma.
       fuelSuppliers = fuelSuppliers.split(",")
       for fuelSupplier in fuelSuppliers:
         result = result.filter(fuelSupplier__id = fuelSupplier)
    if surname != None:
       result = result.filter(surname__icontains = surname)
    if includeInactive != True:
       result = result.filter(fuelSupplierId__fuelSupplierStatusId__status = 'Active')
       
    serializer = serializers.UserSerializer(result, many=True)
    return Response(serializer.data)    
