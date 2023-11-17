from django.db import migrations
from django.core.exceptions import ValidationError

def create_missing_credit_trade_history(apps, schema_editor):
    CreditTrade = apps.get_model('api', 'CreditTrade')
    CreditTradeHistory = apps.get_model('api', 'CreditTradeHistory')
    User = apps.get_model('auth', 'User')
    Role = apps.get_model('api', 'Role')

    for credit_trade in CreditTrade.objects.filter(is_rescinded=True):
        if not CreditTradeHistory.objects.filter(credit_trade_id=credit_trade.id, is_rescinded=True).exists():
            user = credit_trade.create_user if credit_trade.create_user else User.objects.first()
            
            user_roles = Role.objects.filter(user_roles__user_id=user.id)

            role_id = None
            if user_roles.filter(name="GovDirector").exists():
                role_id = user_roles.get(name="GovDirector").id
            elif user_roles.filter(name="GovDeputyDirector").exists():
                role_id = user_roles.get(name="GovDeputyDirector").id
            elif user_roles.exists():
                role_id = user_roles.first().id

            history = CreditTradeHistory(
                credit_trade_id=credit_trade.id,
                respondent_id=credit_trade.respondent.id,
                status_id=credit_trade.status.id,
                type_id=credit_trade.type.id,
                number_of_credits=credit_trade.number_of_credits,
                fair_market_value_per_credit=credit_trade.fair_market_value_per_credit,
                zero_reason_id=credit_trade.zero_reason.id if credit_trade.zero_reason else None,
                trade_effective_date=credit_trade.trade_effective_date,
                compliance_period_id=credit_trade.compliance_period.id if credit_trade.compliance_period else None,
                is_rescinded=True,
                create_user=user,
                user_role_id=role_id,
                date_of_written_agreement=credit_trade.date_of_written_agreement,
                category_d_selected=credit_trade.category_d_selected
            )

            try:
                history.full_clean()  
                history.save()
            except ValidationError as error:
                # Handle validation error if necessary
                raise ValidationError(error)
            
            # Update the create_timestamp field
            history.create_timestamp = credit_trade.update_timestamp
            history.save(update_fields=['create_timestamp'])

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0014_update_signing_authority_assertion_expirations'),
    ]

    operations = [
        migrations.RunPython(create_missing_credit_trade_history),
    ]
