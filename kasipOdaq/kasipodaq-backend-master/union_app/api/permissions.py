from rest_framework.permissions import BasePermission
from union_app import tools


class ActionAccessPermission(BasePermission):
    def has_permission(self, request, view):
        permission_manager = tools.PermissionManager()
        print(view.action)

        return permission_manager.has_permission([])
