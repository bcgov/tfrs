from django.db.models import Q

from api.models.User import User


class NotificationService():
    """
    Centralized service to send out notifications.
    Notification can be Email, SMS or Push
    """

    @staticmethod
    def send(credit_trade):
        """
        Call the function to send the notification.
        This starts off checking what type it is, then calls the right
        function base on the type
        """

        # if PVR
        if credit_trade.type.the_type in [
                "Credit Retirement", "Credit Validation", "Part 3 Award"]:
            recipients = NotificationService.get_pvr_recipients(credit_trade)
        else:
            recipients = NotificationService.get_ct_recipients(credit_trade)

        # send the actual notification
        NotificationService.send_notification(credit_trade, recipients)

    @staticmethod
    def get_ct_recipients(credit_trade):
        """
        Get recipients for Notifications (for Credit Trades)
        """
        if credit_trade.status.status == "Draft":
            return User.objects.filter(organization=credit_trade.initiator)

        if credit_trade.status.status in ["Submitted", "Refused"]:
            return User.objects.filter(organization__in=[
                credit_trade.initiator, credit_trade.respondent])

        if credit_trade.status.status in ["Recommended", "Not Recommended"]:
            return User.objects.filter(
                user_roles__role__is_government_role=True)

        if credit_trade.status.status in ["Accepted", "Declined", "Completed"]:
            return User.objects.filter(
                Q(organization__in=[
                    credit_trade.initiator, credit_trade.respondent
                ]) | Q(user_roles__role__is_government_role=True))

        return None

    @staticmethod
    def get_pvr_recipients(credit_trade):
        """
        Get recipients for Notifications (for Government Transfers)
        """
        if credit_trade.status.status in ["Draft", "Recommended"]:
            return User.objects.filter(
                user_roles__role__is_government_role=True)

        if credit_trade.status.status in ["Completed", "Declined"]:
            return User.objects.filter(
                Q(organization__in=[
                    credit_trade.initiator, credit_trade.respondent
                ]) | Q(user_roles__role__is_government_role=True))

        return None

    @staticmethod
    def send_notification(credit_trade, recipients):
        """
        Sends the actual notification via SMTP, SMS or In App.
        This will depend on what the user's settings
        """
        pass
