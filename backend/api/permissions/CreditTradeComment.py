from rest_framework import permissions
from api.services.CreditTradeService import CreditTradeService

class CreditTradeCommentPermissions(permissions.BasePermission):

    # When an object does not yet exist (POST)
    def has_permission(self, request, view):
        # Fallback to has_object_permission unless it's a POST
        if request.method != 'POST':
            return True

        # Need this information to make a decision
        if not (request.data.has_key('privileged_access') and
                request.data.has_key('credit_trade')):
            return False

        credit_trade = request.data['credit_trade']
        privileged_access = request.data['privileged_access']

        '''
        Check if the user is a party to this credit_trade (or Government)
        using CreditTradeService logic
        '''
        found = CreditTradeService.get_organization_credit_trades(request.user.organization)\
            .filter(id=credit_trade).exists()

        if found:
            if privileged_access:
                return request.user.has_perm('EDIT_PRIVILEGED_COMMENTS')
            else:
                return True

        return False

    # Used when an object exists (PUT, GET)
    def has_object_permission(self, request, view, obj):

        # Users can always see and edit their own comments
        if obj.create_user == request.user:
            return True

        # And see but not edit those from their others in their own organization
        if obj.create_user.organization == request.user.organization and \
                request.method in permissions.SAFE_METHODS:
            return True

        '''
        Government roles can always view comments
        and can view or edit privileged comments with correct permission
        '''
        if request.user.role is not None and request.user.role.is_government_role:

            # read
            if request.method in permissions.SAFE_METHODS:
                if obj.privileged_access:
                    return request.user.has_perm('VIEW_PRIVILEGED_COMMENTS')
                else:
                    return True

            # write
            if request.method not in permissions.SAFE_METHODS:
                if obj.privileged_access:
                    return request.user.has_perm('EDIT_PRIVILEGED_COMMENTS')
                else:
                    return True

        # not authorized
        return False
