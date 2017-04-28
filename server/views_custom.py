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
import sys
import json
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions 
from rest_framework import mixins
from rest_framework import generics
from rest_framework_bulk import BulkCreateModelMixin
from . import serializers
from .models.Attachment import Attachment
from .models.AttachmentViewModel import AttachmentViewModel
from .models.Audit import Audit
from .models.CompliancePeriod import CompliancePeriod
from .models.Contact import Contact
from .models.CreditTrade import CreditTrade
from .models.CreditTradeLogEntry import CreditTradeLogEntry
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.FuelSupplier import FuelSupplier
from .models.Group import Group
from .models.GroupMembership import GroupMembership
from .models.GroupMembershipViewModel import GroupMembershipViewModel
from .models.GroupViewModel import GroupViewModel
from .models.History import History
from .models.HistoryViewModel import HistoryViewModel
from .models.LookupList import LookupList
from .models.Note import Note
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationViewModel import NotificationViewModel
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

class attachmentsIdDownloadGet(APIView):  
  def get(self, request, id):
    """  
    Returns the binary file component of an attachment  
    """
    try:
      attachment = Attachment.objects.get(id=id)
      response = HttpResponse(attachment.fileContents, content_type='application/octet-stream')
      response['Content-Disposition'] = 'attachment; filename=' + attachment.fileName
      response['Content-Length'] = sys.getsizeof(attachment.fileContents)    
      return response  
    except Attachment.DoesNotExist:
      return HttpResponse(status=404)

class attachmentsUploadPost(APIView):
  def get(self, request):
    """  
    File upload form.  
    """     
    return HttpResponse("<html><body><form method=\"post\" action=\"/api/attachments/upload\" enctype=\"multipart/form-data\"><input type=\"file\" name = \"file\" /><br>Description <input type=text name=description><br>Type <input type=text name=type><br><input type = \"submit\" value = \"Upload\" /></body></html>")

  def post(self, request):
    """  
    Accepts a new file upload.  
    """
    jsonString = self.request.POST['item']
    data = json.loads(jsonString)
    fileName = request.FILES['file'].name
    fileData = request.FILES['file'].read()
    attachment = Attachment(fileContents=fileData, fileName=fileName, description=data['description'],type=data['type'])    
    attachment.save()
    # convert the attachment to json.
    serializer = serializers.AttachmentSerializer(attachment)
    return Response(serializer.data)

class credittradesIdNotesGet(APIView):
  """  
  Returns notes for a particular CreditTrade  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):     
    """
    Returns notes for a particular CreditTrade
    """
    creditTrade = CreditTrade.objects.filter(id=id)    
    serializer = serializers.NotesSerializer(creditTrade.notes, many=True)    
    return Response(serializer.data)

  def post(self, request, id ): 
    """
    Add a note to the creditTrade
    """
    creditTrade = CreditTrade.objects.get(id=id)   
    # the body of the post is the data to be added.
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    note = Note(noteText=data['noteText'], isNoLongerRelevant=data['isNoLongerRelevant'])
    note.save()
    creditTrade.notes.add(note)
    creditTrade.save()
    serializer = serializers.NoteSerializer(note)
    return Response(serializer.data)

class credittradesIdAttachmentsGet(mixins.CreateModelMixin, APIView):
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer

  def get(self, request, id):
    """  
    Returns attachments for a particular CreditTrade  
    """
    creditTrade = CreditTrade.objects.get(id=id)    
    serializer = AttachmentSerializer(creditTrade.attachments, many=True)
    return Response(serializer.data)

  def post(self, request, id):
    """  
    Accepts a new file upload.  
    """
    jsonString = request.body.decode('utf-8')
    jsonString = self.request.POST['item']
    data = json.loads(jsonString)
    fileName = request.FILES['file'].name
    fileData = request.FILES['file'].read()
    attachment = Attachment(fileContents=fileData, fileName=fileName, description=data['description'],type=data['type'])    
    attachment.save()
    creditTrade = CreditTrade.objects.get(id=id)   
    creditTrade.attachments.add (attachment)
    creditTrade.save()
    serializer = serializers.AttachmentSerializer(attachment)
    return Response(serializer.data)

class credittradesIdHistoryGet(mixins.CreateModelMixin, APIView):
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
     
  def get(self, request, id, offset = None, limit = None):
    """  
    Returns History for a particular CreditTrade  
    """
    creditTrade = CreditTrade.objects.filter(id=id)    
    serializer = serializers.HistorySerializer(creditTrade.history, many=True)
    return Response(serializer.data)

  def post(self, request, id):
    """  
    Add a History record to the CreditTrade  
    """
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    history = History(historyText=data['historyText'])
    history.save()

    creditTrade = CreditTrade.objects.get(id=id)       
    creditTrade.history.add(history)
    creditTrade.save()
    serializer = serializers.HistorySerializer(history)
    return Response(serializer.data)

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
    userFavourite.remove()
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
    userFavourite = UserFavourite(type = data['type'], name = data['name'], value = data['value'], isDefault = data['isDefault'], user = user)
    userFavourite.save()
    serializer = serializers.UserFavouriteSerializer(userFavourite)
    return Response(serializer.data)  

  def put(self, request):
    user = User.objects.all()[0] # replace with getcurrentuserid    
    jsonString = request.body.decode('utf-8')
    alldata = json.loads(jsonString)
    # clear existing favourites.
    UserFavourite.objects.filter(user=user).delete()

    # add the replacement favourites
    for data in alldata:
      userFavourite = UserFavourite(type = data['type'], name = data['name'], value = data['value'], isDefault = data['isDefault'], user = user)
      userFavourite.save()
    result = UserFavourite.objects.filter(user=user)
    serializer = serializers.UserFavouriteSerializer(result, many=True)
    return Response(serializer.data)  

class usersCurrentFavouritesSearchGet(APIView):
  """  
  Returns a user's favourites of a given type.   
  """
  # enter code for this routine here.        
  
  def get(self, request):
    currentUser = User.objects.all()[0] # replace with current user
    type = request.GET.get('type', None)
    userFavourites = UserFavourite.objects.filter(user = currentUser)
    if type != None:
        userFavourites = userFavourites.filter(type = type)

    serializer = serializers.UserFavouriteSerializer(userFavourites, many=True)
    return Response(serializer.data)
    

class usersCurrentGet(APIView):
  """  
  Get the currently logged in user  
  """
  # enter code for this routine here.        
  
  def get(self, request, ):
    currentUser = User.objects.all()[0] # replace with current user
    serializer = serializers.UserSerializer(currentUser)
    return Response(serializer.data)

class fuelsuppliersIdAttachmentsGet(mixins.CreateModelMixin, APIView):
  """  
  Returns attachments for a particular FuelSupplier  
  """
  # enter code for this routine here.        
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer

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
    fileData = request.FILES['file'].read()
    attachment = Attachment(fileContents=fileData, fileName=fileName, description=data['description'],type=data['type'])    
    attachment.save()
    fuelSupplier = FuelSupplier.objects.get(id=id)   
    fuelSupplier.attachments.add (attachment)
    fuelSupplier.save()
    serializer = serializers.AttachmentSerializer(attachment)
    return Response(serializer.data)

class fuelsuppliersIdHistoryGet(APIView):
  """  
  Returns History for a particular FuelSupplier  
  """  
  
  def get(self, request, id, offset = None, limit = None):
    fuelSupplier = FuelSupplier.objects.get(id=id)
    serializer = serializers.HistorySerializer(fuelSupplier.history, many=true)
    return Response(serializer.data)

  def post(self, request, id):
    """  
    Add a History record to the FuelSupplier  
    """
    fuelSupplier = FuelSupplier.objects.get(id=id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    history = History(historyText=data['historyText'])
    history.save()
    fuelSupplier.history.add(history)
    fuelSupplier.save()
    serializer = serializers.HistorySerializer(history)
    return Response(serializer.data)  

class fuelsuppliersIdNotesGet(APIView):    
  
  def get(self, request, id):     
    """
    Returns notes for a particular FuelSupplier
    """
    fuelSupplier = FuelSupplier.objects.get(id=id)    
    serializer = serializers.NotesSerializer(fuelSupplier.notes, many=True)    
    return Response(serializer.data)

  def post(self, request, id ): 
    """
    Add a note to the FuelSupplier
    """
    fuelSupplier = FuelSupplier.objects.get(id=id)   
    # the body of the post is the data to be added.
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    note = Note(noteText=data['noteText'], isNoLongerRelevant=data['isNoLongerRelevant'])
    note.save()
    fuelSupplier.notes.add(note)
    fuelSupplier.save()
    serializer = serializers.NoteSerializer(note)
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
       result = result.filter(status__icontains = 'Active')
        
    serializer = serializers.FuelSupplierSerializer(result, many=True)
    return Response(serializer.data)    

class groupsIdUsersGet(APIView):
  """  
  returns users in a given Group  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    group = Group.objects.get (id = id)
    groupMembership = GroupMembership.objects.filter(group=group)
    serializer = serializers.GroupMembershipSerializer(groupMembership.users, many=True)
    return Response(serializer.data)
    

class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    role = Role.objects.get (id = id)
    rolePermissions = RolePermission.objects.filter(role = role)    
    serializer = serializers.RolePermissionSerializer(rolePermissions, many=True)
    return Response(serializer.data)
  
  def post(self, request, id):
    """  
    Adds a permission to a role  
    """
    role = Role.objects.get (id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    permission = Permission.objects.get(id = data['permission'])
    rolePermission = RolePermission(role = role, permission = permission)
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
        permission = Permission.objects.get(id = data['permission'])
        rolePermission = RolePermission (permission = permission, role = role)
        rolePermission.save()
    results = RolePermission.objects.filter(role=role)
    serializer = serializers.RolePermissionSerializer(results, many=True)
    return Response(serializer.data)    

class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    role = Role.objects.get (id = id)       
    serializer = serializers.UserSerializer(role.users)
    return Response(serializer.data)        

class rolesIdUsersPut(APIView):
  """  
  Updates the users for a role  
  """
  # enter code for this routine here.        
  
  def put(self, request, id, items):
    return Response()

class usersIdFavouritesGet(APIView):
  def get(self, request, id):
    """  
    Returns the favourites for a user  
    """
    user = User.objects.get(id)
    result = UserFavourite.objects.filter(user=user)
    serializer = serializers.UserFavouriteSerializer(result)
    return Response(serializer.data)  

  def post(self, request, id):    
    """  
    Adds favourites to a user  
    """  
    user = User.objects.get(id=id)    
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    userFavourite = UserFavourite(type = data['type'], name = data['name'], value = data['value'], isDefault = data['isDefault'], user = user)
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
    UserFavourite.objects.filter(user=user).delete()

    # add the replacement favourites
    for data in alldata:
      userFavourite = UserFavourite(type = data['type'], name = data['name'], value = data['value'], isDefault = data['isDefault'], user = user)
      userFavourite.save()
    result = UserFavourite.objects.filter(user=user)
    serializer = serializers.UserFavouriteSerializer(result, many=True)
    return Response(serializer.data)  

class usersIdGroupsGet(APIView):            
  
  def get(self, request, id):
    """  
    Returns all groups that a user is a member of  
    """
    group = Group.objects.get(id=id)
    result = GroupMembership.objects.filter(group=group)
    serializer = serializers.GroupMembershipSerializer(result, many=True)
    return Response(serializer.data)
  
  def post(self, request, id):
    """  
    Adds a user to a group.  
    """    
    user = User.objects.get(id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    group = Group.objects.get(id = data['group'])
    groupMembership = GroupMembership(active = data['active'], group = group, user = user)
    groupMembership.save()
    serializer = serializers.GroupMembershipSerializer(groupMembership)
    return Response(serializer.data)
    
  def put(self, request, id):
    return Response()

class usersIdNotificationsGet(APIView):        
  
  def get(self, request, id):
    """  
    Returns a user's notifications 
    """
    user = User.objects.get(id=id)
    result = Notification.objects.filter(user=user)
    serializer = serializers.NotificationSerializer(result, many=True)
    return Response(serializer.data)
  
  def post(self, request, id):
    """  
    Adds a notification to user 
    """    
    user = User.objects.get(id = id)
    jsonString = request.body.decode('utf-8')
    data = json.loads(jsonString)
    notificationEvent = NotificationEvent.objects.get(id=data['event'])
    notification = Notification(event = notificationEvent, hasBeenViewed = data['hasBeenViewed'], isWatchNotification = data['isWatchNotification'], user = user)
    notification.save()
    serializer = serializers.NotificationSerializer(notification)
    return Response(serializer.data)

class usersIdPermissionsGet(APIView):
  """  
  Returns the set of permissions for a user  
  """
  def get(self, request, id):
    """  
    Returns a user's permissions 
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
    return Response()

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
       result = result.filter(status = 'Active')    
       
    serializer = serializers.UserSerializer(result, many=True)
    return Response(serializer.data)    


