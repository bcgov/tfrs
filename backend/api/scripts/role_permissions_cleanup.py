from api.models.RolePermission import RolePermission


def run():
    """
    Removes the extra permissions from GovUser and GovAnalyst
    """
    analyst_permissions = RolePermission.objects.filter(
        permission__code__in=[
            "REFUSE_CREDIT_TRANSFER",
            "SIGN_CREDIT_TRANSFER",
            "DECLINE_CREDIT_TRANSFER",
            "APPROVE_CREDIT_TRANSFER"
        ],
        role__name="GovUser")

    count = analyst_permissions.count()
    analyst_permissions.delete()

    print('Deleted {} permission(s) from GovUser'.format(
        count))

    director_permissions = RolePermission.objects.filter(
        permission__code__in=[
            "REFUSE_CREDIT_TRANSFER",
            "SIGN_CREDIT_TRANSFER",
            "RECOMMEND_CREDIT_TRANSFER",
            "PROPOSE_CREDIT_TRANSFER"
        ],
        role__name="GovDirector")

    count = director_permissions.count()
    director_permissions.delete()

    print('Deleted {} permission(s) from GovDirector'.format(
        count))

    director_permissions = RolePermission.objects.filter(
        permission__code__in=[
            "PROPOSE_CREDIT_TRANSFER"
        ],
        role__name="FSManager")

    count = director_permissions.count()
    director_permissions.delete()

    print('Deleted {} permission(s) from FSManager'.format(
        count))
