from rest_framework import permissions

class CreditTradeCommentPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        # Users can always see and edit their own comments
        if obj.create_user == request.user:
            return True

        '''
        Government roles can always view comments
        and can view or edit privileged comments with correct permission
        '''
        if request.user.role is not None and request.user.role.is_government_role:

            # read
            if request.method in permissions.SAFE_METHODS:
                if obj.privileged_access:
                    print ("This requires a privilege")
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
