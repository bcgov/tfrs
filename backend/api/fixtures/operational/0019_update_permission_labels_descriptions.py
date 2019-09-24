from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.Permission import Permission


class UpdatePermissionLabels(OperationalDataScript):
    """
    Updates Permission Labels and Descriptions
    """
    is_revertable = False
    comment = 'Updates Permission Labels and Descriptions'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        Permission.objects.filter(
            code="ADD_COMMENT"
        ).update(
            name="Add comment",
            description="add comments where available"
        )

        Permission.objects.filter(
            code="ASSIGN_GOVERNMENT_ROLES"
        ).update(
            name="Assign Government Roles",
            description="assign roles to government (IDIR) users"
        )

        Permission.objects.filter(
            code="ASSIGN_FS_ROLES"
        ).update(
            name="Assign roles to users",
            description="assign roles to (BCeID) users"
        )

        Permission.objects.filter(
            code="EDIT_COMPLIANCE_PERIODS"
        ).update(
            name="Edit compliance periods",
            description="edit compliance periods"
        )

        Permission.objects.filter(
            code="LOGIN"
        ).update(
            name="Edit compliance periods",
            description="authenticate using BCeID or IDIR credentials to "
                        "gain access to TFRS"
        )

        Permission.objects.filter(
            code="EDIT_FUEL_SUPPLIERS"
        ).update(
            name="Organization management",
            description="add new organizations and edit organization "
                        "information"
        )

        Permission.objects.filter(
            code="EDIT_FUEL_SUPPLIERS"
        ).update(
            name="Organization management",
            description="add new organizations and edit organization "
                        "information"
        )

        Permission.objects.filter(
            code="ROLES_AND_PERMISSIONS"
        ).update(
            name="Roles and permissions",
            description="view roles and permissions information"
        )

        Permission.objects.filter(
            code="USER_MANAGEMENT"
        ).update(
            name="User management",
            description="add new users and edit existing users"
        )

        Permission.objects.filter(
            code="VIEW_CREDIT_TRANSFERS"
        ).update(
            name="View credit transactions",
            description="view credit transactions"
        )

        Permission.objects.filter(
            code="VIEW_FUEL_SUPPLIERS"
        ).update(
            name="View fuel supplier organization information",
            description="view organization information"
        )

        Permission.objects.filter(
            code="VIEW_APPROVED_CREDIT_TRANSFERS"
        ).update(
            name="View recorded credit transactions",
            description="view credit transactions within the Historical "
                        "Data Entry tool prior to them being committed"
        )

        Permission.objects.filter(
            code="MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT"
        ).update(
            name="Recommend acceptance",
            description="recommend acceptance of a compliance report"
        )

        Permission.objects.filter(
            code="MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
        ).update(
            name="Recommend rejection",
            description="recommend rejection of a compliance report"
        )

        Permission.objects.filter(
            code="MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
        ).update(
            name="Recommend rejection",
            description="recommend rejection of a compliance report"
        )

        Permission.objects.filter(
            code="VIEW_COMPLIANCE_REPORT"
        ).update(
            name="View compliance reports",
            description="view compliance reports"
        )

        Permission.objects.filter(
            code="COMPLIANCE_REPORT_MANAGE"
        ).update(
            name="Manage compliance reports",
            description="create, edit and delete compliance reports"
        )

        Permission.objects.filter(
            code="ADD_COMMENT"
        ).update(
            name="Add comment",
            description="add comments where available"
        )

        Permission.objects.filter(
            code="PROPOSE_CREDIT_TRANSFER"
        ).update(
            name="Create New Credit Transfer Proposal",
            description="create new credit transfer proposal"
        )

        Permission.objects.filter(
            code="REFUSE_CREDIT_TRANSFER"
        ).update(
            name="Refuse a credit transfer proposal",
            description="refuse a credit transfer proposal received from "
                        "another organization"
        )

        Permission.objects.filter(
            code="RESCIND_CREDIT_TRANSFER"
        ).update(
            name="Rescind a credit transfer proposal",
            description="rescind a credit transfer proposal sent to another "
                        "organization"
        )

        Permission.objects.filter(
            code="FUEL_CODES_VIEW"
        ).update(
            name="View fuel codes",
            description="view fuel codes"
        )

        Permission.objects.filter(
            code="DOCUMENTS_SUBMIT"
        ).update(
            name="File submissions",
            description="can submit files to government"
        )

        Permission.objects.filter(
            code="DOCUMENTS_CREATE_DRAFT"
        ).update(
            name="Upload files",
            description="can upload files"
        )

        Permission.objects.filter(
            code="DOCUMENTS_VIEW"
        ).update(
            name="View file submissions",
            description="view files submitted to Government"
        )

        Permission.objects.filter(
            code="CREDIT_CALCULATION_MANAGE"
        ).update(
            name="Edit credit calculation values",
            description="edit values used in credit calculation formula"
        )

        Permission.objects.filter(
            code="FUEL_CODES_MANAGE"
        ).update(
            name="Edit fuel codes",
            description="add and edit fuel codes"
        )

        Permission.objects.filter(
            code="EDIT_PRIVILEGED_COMMENTS"
        ).update(
            name="Edit internal comments",
            description="add and edit internal comments where available"
        )

        Permission.objects.filter(
            code="DOCUMENTS_LINK_TO_CREDIT_TRADE"
        ).update(
            name="Link file submissions to Part 3 Awards",
            description="establish link between file submissions and Part 3 "
                        "Awards"
        )

        Permission.objects.filter(
            code="ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT"
        ).update(
            name="Recommend acceptance",
            description="recommend acceptance of a compliance report"
        )

        Permission.objects.filter(
            code="RECOMMEND_CREDIT_TRANSFER"
        ).update(
            name="Recommend Credit Transfer Proposals and Part 3 Awards",
            description="recommend or not recommend approval of Credit "
                        "Transfer Proposals and Part 3 Awards"
        )

        Permission.objects.filter(
            code="ANALYST_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
        ).update(
            name="Recommend rejection",
            description="recommend rejection of a compliance report"
        )

        Permission.objects.filter(
            code="DOCUMENTS_GOVERNMENT_REVIEW"
        ).update(
            name="Review file submissions",
            description="view file submissions and mark them as received"
        )

        Permission.objects.filter(
            code="USE_HISTORICAL_DATA_ENTRY"
        ).update(
            name="Use Historical Data Entry",
            description="Record credit transactions approved outside of TFRS"
        )

        Permission.objects.filter(
            code="CREDIT_CALCULATION_VIEW"
        ).update(
            name="View credit calculation values",
            description="view values used in credit calculation formula"
        )

        Permission.objects.filter(
            code="VIEW_PRIVILEGED_COMMENTS"
        ).update(
            name="View internal comments",
            description="view internal comments"
        )

        Permission.objects.filter(
            code="APPROVE_COMPLIANCE_REPORT"
        ).update(
            name="Accept compliance reports",
            description="accept compliance reports"
        )

        Permission.objects.filter(
            code="APPROVE_CREDIT_TRANSFER"
        ).update(
            name="Approve credit transfer proposals and Part 3 Awards",
            description="approve credit transfer proposals and Part 3 Awards"
        )

        Permission.objects.filter(
            code="DECLINE_CREDIT_TRANSFER"
        ).update(
            name="Decline to approve credit transfer proposals and Part 3 "
                 "Awards",
            description="decline credit transfer proposals and Part 3 Awards"
        )

        Permission.objects.filter(
            code="CREDIT_CALCULATION_MANAGE"
        ).update(
            name="Edit credit calculation values",
            description="edit values used in credit calculation formula"
        )

        Permission.objects.filter(
            code="REJECT_COMPLIANCE_REPORT"
        ).update(
            name="Reject compliance reports",
            description="reject compliance reports"
        )

        Permission.objects.filter(
            code="SIGN_COMPLIANCE_REPORT"
        ).update(
            name="Submit compliance reports",
            description="submit compliance reports to Government"
        )

        Permission.objects.filter(
            code="SIGN_CREDIT_TRANSFER"
        ).update(
            name="Propose and accept credit transfer proposals",
            description="propose and accept credit transfer proposals"
        )

script_class = UpdatePermissionLabels
