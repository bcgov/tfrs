# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20170214_1526'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('fileName', models.CharField(max_length=255)),
                ('fileContents', models.BinaryField()),
                ('description', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='AttachmentViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('fileName', models.CharField(max_length=2048)),
                ('description', models.CharField(max_length=2048)),
                ('type', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Audit',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('appCreateTimestamp', models.DateField()),
                ('appCreateUserid', models.CharField(max_length=255)),
                ('appCreateUserGuid', models.CharField(max_length=255)),
                ('appCreateUserDirectory', models.CharField(max_length=255)),
                ('appLastUpdateTimestamp', models.DateField()),
                ('appLastUpdateUserid', models.CharField(max_length=255)),
                ('appLastUpdateUserGuid', models.CharField(max_length=255)),
                ('appLastUpdateUserDirectory', models.CharField(max_length=255)),
                ('entityName', models.CharField(max_length=255)),
                ('entityId', models.IntegerField()),
                ('propertyName', models.CharField(max_length=255)),
                ('oldValue', models.CharField(max_length=255)),
                ('newValue', models.CharField(max_length=255)),
                ('isDelete', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='CompliancePeriod',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('periodName', models.CharField(max_length=255)),
                ('isActive', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('givenName', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('organizationName', models.CharField(max_length=255)),
                ('role', models.CharField(max_length=255)),
                ('notes', models.CharField(max_length=255)),
                ('emailAddress', models.CharField(max_length=255)),
                ('workPhoneNumber', models.CharField(max_length=255)),
                ('mobilePhoneNumber', models.CharField(max_length=255)),
                ('faxPhoneNumber', models.CharField(max_length=255)),
                ('address1', models.CharField(max_length=255)),
                ('address2', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('province', models.CharField(max_length=255)),
                ('postalCode', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='CreditTrade',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('status', models.CharField(max_length=255)),
                ('tradeExecutionDate', models.DateField()),
                ('transactionType', models.CharField(max_length=255)),
                ('numberOfCredits', models.IntegerField()),
                ('fairMarketValuePrice', models.CharField(max_length=255)),
                ('fuelSupplierBalanceAtTransactionTime', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='CreditTradeLogEntry',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('logEntryTime', models.DateField()),
                ('newStatus', models.CharField(max_length=255)),
                ('newTradeExecutionDate', models.DateField()),
                ('newTransactionType', models.CharField(max_length=255)),
                ('newNumberOfCredits', models.IntegerField()),
                ('newFairMarketValuePrice', models.CharField(max_length=255)),
                ('newFuelSupplierBalanceAtTransactionTime', models.IntegerField()),
                ('creditTrade', models.ForeignKey(to='api.CreditTrade', related_name='CreditTradeLogEntrycreditTrade')),
                ('newCompliancePeriod', models.ForeignKey(to='api.CompliancePeriod', related_name='CreditTradeLogEntrynewCompliancePeriod')),
            ],
        ),
        migrations.CreateModel(
            name='CurrentUserViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('givenName', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('active', models.BooleanField()),
                ('smUserId', models.CharField(max_length=255)),
                ('smAuthorizationDirectory', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='GroupMembership',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('active', models.BooleanField()),
                ('group', models.ForeignKey(to='api.Group', related_name='GroupMembershipgroup')),
            ],
        ),
        migrations.CreateModel(
            name='GroupMembershipViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('active', models.BooleanField()),
                ('groupId', models.IntegerField()),
                ('userId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='GroupViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('historyText', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='HistoryViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('historyText', models.CharField(max_length=2048)),
                ('lastUpdateUserid', models.CharField(max_length=255)),
                ('lastUpdateTimestamp', models.DateField()),
                ('affectedEntityId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='LookupList',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('contextName', models.CharField(max_length=255)),
                ('isDefault', models.BooleanField()),
                ('displaySortOrder', models.IntegerField()),
                ('codeName', models.CharField(max_length=255)),
                ('value', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('noteText', models.CharField(max_length=255)),
                ('isNoLongerRelevant', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('hasBeenViewed', models.BooleanField()),
                ('isWatchNotification', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='NotificationEvent',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('eventTime', models.DateField()),
                ('eventTypeCode', models.CharField(max_length=255)),
                ('notes', models.CharField(max_length=255)),
                ('creditTrade', models.ForeignKey(to='api.CreditTrade', related_name='NotificationEventcreditTrade')),
            ],
        ),
        migrations.CreateModel(
            name='NotificationViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('eventId', models.IntegerField()),
                ('event2Id', models.IntegerField()),
                ('hasBeenViewed', models.BooleanField()),
                ('isWatchNotification', models.BooleanField()),
                ('isExpired', models.BooleanField()),
                ('isAllDay', models.BooleanField()),
                ('priorityCode', models.CharField(max_length=255)),
                ('userId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Permission',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('code', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PermissionViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('code', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='RolePermission',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('permission', models.ForeignKey(to='api.Permission', related_name='RolePermissionpermission')),
                ('role', models.ForeignKey(to='api.Role', related_name='RolePermissionrole')),
            ],
        ),
        migrations.CreateModel(
            name='RolePermissionViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('roleId', models.IntegerField()),
                ('permissionId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='RoleViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='UserDetailsViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('givenName', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('initials', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('active', models.BooleanField()),
                ('permissions', models.ManyToManyField(to='api.PermissionViewModel', related_name='UserDetailsViewModelpermissions')),
            ],
        ),
        migrations.CreateModel(
            name='UserFavourite',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('type', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('value', models.CharField(max_length=255)),
                ('isDefault', models.BooleanField()),
                ('User', models.ForeignKey(to='api.User', related_name='UserFavouriteUser')),
            ],
        ),
        migrations.CreateModel(
            name='UserFavouriteViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('value', models.CharField(max_length=255)),
                ('isDefault', models.BooleanField()),
                ('type', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('effectiveDate', models.DateField()),
                ('expiryDate', models.DateField()),
                ('role', models.ForeignKey(to='api.Role', related_name='UserRolerole')),
                ('user', models.ForeignKey(to='api.User', related_name='UserRoleuser')),
            ],
        ),
        migrations.CreateModel(
            name='UserRoleViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('effectiveDate', models.DateField()),
                ('expiryDate', models.DateField()),
                ('roleId', models.IntegerField()),
                ('userId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='UserViewModel',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('givenName', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('active', models.BooleanField()),
                ('smUserId', models.CharField(max_length=255)),
                ('groupMemberships', models.ManyToManyField(to='api.GroupMembership', related_name='UserViewModelgroupMemberships')),
                ('userRoles', models.ManyToManyField(to='api.UserRole', related_name='UserViewModeluserRoles')),
            ],
        ),
        migrations.RemoveField(
            model_name='fuelsupply',
            name='fuel_supplier',
        ),
        migrations.RemoveField(
            model_name='fuelsupply',
            name='fuel_type',
        ),
        migrations.RemoveField(
            model_name='fueltype',
            name='fuel_class',
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='dateCreated',
            field=models.DateField(default=datetime.datetime(2017, 4, 21, 20, 27, 45, 30575, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='status',
            field=models.CharField(max_length=255, default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.DeleteModel(
            name='FuelClass',
        ),
        migrations.DeleteModel(
            name='FuelSupply',
        ),
        migrations.DeleteModel(
            name='FuelType',
        ),
        migrations.AddField(
            model_name='user',
            name='fuelSupplier',
            field=models.ForeignKey(to='api.FuelSupplier', related_name='UserfuelSupplier'),
        ),
        migrations.AddField(
            model_name='notification',
            name='event',
            field=models.ForeignKey(to='api.NotificationEvent', related_name='Notificationevent'),
        ),
        migrations.AddField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(to='api.User', related_name='Notificationuser'),
        ),
        migrations.AddField(
            model_name='groupmembership',
            name='user',
            field=models.ForeignKey(to='api.User', related_name='GroupMembershipuser'),
        ),
        migrations.AddField(
            model_name='currentuserviewmodel',
            name='groupMemberships',
            field=models.ManyToManyField(to='api.GroupMembership', related_name='CurrentUserViewModelgroupMemberships'),
        ),
        migrations.AddField(
            model_name='currentuserviewmodel',
            name='userRoles',
            field=models.ManyToManyField(to='api.UserRole', related_name='CurrentUserViewModeluserRoles'),
        ),
        migrations.AddField(
            model_name='credittradelogentry',
            name='user',
            field=models.ForeignKey(to='api.User', related_name='CreditTradeLogEntryuser'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='approvedRejectedBy',
            field=models.ForeignKey(to='api.User', related_name='CreditTradeapprovedRejectedBy'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='attachments',
            field=models.ManyToManyField(to='api.Attachment', related_name='CreditTradeattachments'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='cancelledBy',
            field=models.ForeignKey(to='api.User', related_name='CreditTradecancelledBy'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='compliancePeriod',
            field=models.ForeignKey(to='api.CompliancePeriod', related_name='CreditTradecompliancePeriod'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='fuelSupplier',
            field=models.ForeignKey(to='api.FuelSupplier', related_name='CreditTradefuelSupplier'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='fuelSupplierLastUpdatedBy',
            field=models.ForeignKey(to='api.User', related_name='CreditTradefuelSupplierLastUpdatedBy'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='history',
            field=models.ManyToManyField(to='api.History', related_name='CreditTradehistory'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='notes',
            field=models.ManyToManyField(to='api.Note', related_name='CreditTradenotes'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='partnerLastUpdatedBy',
            field=models.ForeignKey(to='api.User', related_name='CreditTradepartnerLastUpdatedBy'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='reviewedRejectedBy',
            field=models.ForeignKey(to='api.User', related_name='CreditTradereviewedRejectedBy'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='transactionPartnerFuelSupplier',
            field=models.ForeignKey(to='api.FuelSupplier', related_name='CreditTradetransactionPartnerFuelSupplier'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='attachments',
            field=models.ManyToManyField(to='api.Attachment', related_name='FuelSupplierattachments'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='contacts',
            field=models.ManyToManyField(to='api.Contact', related_name='FuelSuppliercontacts'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='history',
            field=models.ManyToManyField(to='api.History', related_name='FuelSupplierhistory'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='notes',
            field=models.ManyToManyField(to='api.Note', related_name='FuelSuppliernotes'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='primaryContact',
            field=models.ForeignKey(related_name='FuelSupplierprimaryContact', default=1, to='api.Contact'),
            preserve_default=False,
        ),
    ]
