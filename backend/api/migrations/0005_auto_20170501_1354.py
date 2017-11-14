# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.utils.timezone import utc
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20170427_1726'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AttachmentViewModel',
        ),
        migrations.RemoveField(
            model_name='currentuserviewmodel',
            name='groupMemberships',
        ),
        migrations.RemoveField(
            model_name='currentuserviewmodel',
            name='userRoles',
        ),
        migrations.DeleteModel(
            name='GroupMembershipViewModel',
        ),
        migrations.DeleteModel(
            name='GroupViewModel',
        ),
        migrations.DeleteModel(
            name='HistoryViewModel',
        ),
        migrations.DeleteModel(
            name='NotificationViewModel',
        ),
        migrations.DeleteModel(
            name='RolePermissionViewModel',
        ),
        migrations.DeleteModel(
            name='RoleViewModel',
        ),
        migrations.RemoveField(
            model_name='userdetailsviewmodel',
            name='permissions',
        ),
        migrations.DeleteModel(
            name='UserFavouriteViewModel',
        ),
        migrations.DeleteModel(
            name='UserRoleViewModel',
        ),
        migrations.RemoveField(
            model_name='userviewmodel',
            name='groupMemberships',
        ),
        migrations.RemoveField(
            model_name='userviewmodel',
            name='userRoles',
        ),
        migrations.RemoveField(
            model_name='userfavourite',
            name='User',
        ),
        migrations.AddField(
            model_name='userfavourite',
            name='user',
            field=models.ForeignKey(blank=True, to='api.User', related_name='UserFavouriteuser', null=True),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='description',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='fileContents',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='fileName',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='type',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appCreateUserDirectory',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appCreateUserGuid',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appCreateUserid',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appLastUpdateUserDirectory',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appLastUpdateUserGuid',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appLastUpdateUserid',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='entityName',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='newValue',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='oldValue',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='audit',
            name='propertyName',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='address1',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='address2',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='city',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='emailAddress',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='faxPhoneNumber',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='givenName',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='mobilePhoneNumber',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='notes',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='organizationName',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='postalCode',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='province',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='role',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='surname',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='contact',
            name='workPhoneNumber',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='fairMarketValuePrice',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='initiatorLastUpdateBy',
            field=models.ForeignKey(default = 1, related_name='CreditTradeinitiatorLastUpdateBy', to='api.User'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='respondent',
            field=models.ForeignKey(default = 1, related_name='CreditTraderespondent', to='api.FuelSupplier'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='status',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='logEntryTime',
            field=models.DateField(default=datetime.datetime(2017, 5, 1, 20, 53, 52, 713579, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='newFairMarketValuePrice',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='newTransactionType',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='dateCreated',
            field=models.DateField(default=datetime.datetime(2017, 5, 1, 20, 53, 57, 741984, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='notificationevent',
            name='eventTypeCode',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='notificationevent',
            name='notes',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='offer',
            name='fuelSupplier',
            field=models.ForeignKey(default=1, related_name='OfferfuelSupplier', to='api.FuelSupplier'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='offer',
            name='note',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='guid',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='initials',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='smAuthorizationDirectory',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='smUserId',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='userfavourite',
            name='name',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='userfavourite',
            name='type',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='userfavourite',
            name='value',
            field=models.CharField(blank=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='effectiveDate',
            field=models.DateField(default=datetime.datetime(2017, 5, 1, 20, 54, 8, 737809, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userrole',
            name='role',
            field=models.ForeignKey(default=1, related_name='UserRolerole', to='api.Role'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userrole',
            name='user',
            field=models.ForeignKey(default=1, related_name='UserRoleuser', to='api.User'),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='CurrentUserViewModel',
        ),
        migrations.DeleteModel(
            name='PermissionViewModel',
        ),
        migrations.DeleteModel(
            name='UserDetailsViewModel',
        ),
        migrations.DeleteModel(
            name='UserViewModel',
        ),
    ]
