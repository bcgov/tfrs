from django.core.exceptions import ValidationError

from api.models.DocumentHistory import DocumentHistory


class DocumentService(object):
    """
    Helper functions for Document Service
    """
    @staticmethod
    def create_history(document, is_new=False):
        """
        Create the Document History
        """
        user = (
            document.create_user
            if is_new
            else document.update_user)

        role_id = None

        if user.roles.filter(name="GovUser").exists():
            role_id = user.roles.get(name="GovUser").id
        elif user.roles.filter(name="FSDocSubmit").exists():
            role_id = user.roles.get(name="FSDocSubmit").id
        else:
            role_id = user.roles.first().id

        history = DocumentHistory(
            comment=document.comment,
            compliance_period_id=document.compliance_period_id,
            create_user=document.create_user,
            document_id=document.id,
            status_id=document.status.id,
            title=document.title,
            type_id=document.type.id,
            update_user=document.update_user,
            user_role_id=role_id
        )

        # Validate
        try:
            history.full_clean()
        except ValidationError as error:
            raise ValidationError(error)

        history.save()
