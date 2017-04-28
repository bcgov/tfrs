# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0003_auto_20170421_1327'),
    ]

    operations = [
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('status', models.CharField(max_length=255)),
                ('buyOrSell', models.CharField(max_length=255)),
                ('numberOfCredits', models.IntegerField()),
                ('numberOfViews', models.IntegerField()),
                ('datePosted', models.DateField(null=True, blank=True)),
                ('note', models.CharField(max_length=255)),
            ],
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='compliancePeriod',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='fuelSupplier',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='fuelSupplierBalanceAtTransactionTime',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='fuelSupplierLastUpdatedBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='partnerLastUpdatedBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='transactionPartnerFuelSupplier',
        ),
        migrations.RemoveField(
            model_name='credittradelogentry',
            name='newCompliancePeriod',
        ),
        migrations.AddField(
            model_name='credittrade',
            name='fuelSupplierBalanceBeforeTransaction',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='initiator',
            field=models.ForeignKey(related_name='CreditTradeinitiator', null=True, to='server.FuelSupplier', blank=True),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='initiatorLastUpdateBy',
            field=models.ForeignKey(related_name='CreditTradeinitiatorLastUpdateBy', null=True, to='server.User', blank=True),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='respondent',
            field=models.ForeignKey(related_name='CreditTraderespondent', null=True, to='server.FuelSupplier', blank=True),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='respondentLastUpdatedBy',
            field=models.ForeignKey(related_name='CreditTraderespondentLastUpdatedBy', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appCreateTimestamp',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='audit',
            name='appLastUpdateTimestamp',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='approvedRejectedBy',
            field=models.ForeignKey(related_name='CreditTradeapprovedRejectedBy', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='attachments',
            field=models.ManyToManyField(to='server.Attachment', blank=True, related_name='CreditTradeattachments'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='cancelledBy',
            field=models.ForeignKey(related_name='CreditTradecancelledBy', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='history',
            field=models.ManyToManyField(to='server.History', blank=True, related_name='CreditTradehistory'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='notes',
            field=models.ManyToManyField(to='server.Note', blank=True, related_name='CreditTradenotes'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='reviewedRejectedBy',
            field=models.ForeignKey(related_name='CreditTradereviewedRejectedBy', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='tradeExecutionDate',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='creditTrade',
            field=models.ForeignKey(related_name='CreditTradeLogEntrycreditTrade', null=True, to='server.CreditTrade', blank=True),
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='logEntryTime',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='newTradeExecutionDate',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='credittradelogentry',
            name='user',
            field=models.ForeignKey(related_name='CreditTradeLogEntryuser', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='currentuserviewmodel',
            name='groupMemberships',
            field=models.ManyToManyField(to='server.GroupMembership', blank=True, related_name='CurrentUserViewModelgroupMemberships'),
        ),
        migrations.AlterField(
            model_name='currentuserviewmodel',
            name='userRoles',
            field=models.ManyToManyField(to='server.UserRole', blank=True, related_name='CurrentUserViewModeluserRoles'),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='attachments',
            field=models.ManyToManyField(to='server.Attachment', blank=True, related_name='FuelSupplierattachments'),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='contacts',
            field=models.ManyToManyField(to='server.Contact', blank=True, related_name='FuelSuppliercontacts'),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='dateCreated',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='history',
            field=models.ManyToManyField(to='server.History', blank=True, related_name='FuelSupplierhistory'),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='notes',
            field=models.ManyToManyField(to='server.Note', blank=True, related_name='FuelSuppliernotes'),
        ),
        migrations.AlterField(
            model_name='fuelsupplier',
            name='primaryContact',
            field=models.ForeignKey(related_name='FuelSupplierprimaryContact', null=True, to='server.Contact', blank=True),
        ),
        migrations.AlterField(
            model_name='groupmembership',
            name='group',
            field=models.ForeignKey(related_name='GroupMembershipgroup', null=True, to='server.Group', blank=True),
        ),
        migrations.AlterField(
            model_name='groupmembership',
            name='user',
            field=models.ForeignKey(related_name='GroupMembershipuser', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='historyviewmodel',
            name='lastUpdateTimestamp',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='event',
            field=models.ForeignKey(related_name='Notificationevent', null=True, to='server.NotificationEvent', blank=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(related_name='Notificationuser', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='notificationevent',
            name='creditTrade',
            field=models.ForeignKey(related_name='NotificationEventcreditTrade', null=True, to='server.CreditTrade', blank=True),
        ),
        migrations.AlterField(
            model_name='notificationevent',
            name='eventTime',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='rolepermission',
            name='permission',
            field=models.ForeignKey(related_name='RolePermissionpermission', null=True, to='server.Permission', blank=True),
        ),
        migrations.AlterField(
            model_name='rolepermission',
            name='role',
            field=models.ForeignKey(related_name='RolePermissionrole', null=True, to='server.Role', blank=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='fuelSupplier',
            field=models.ForeignKey(related_name='UserfuelSupplier', null=True, to='server.FuelSupplier', blank=True),
        ),
        migrations.AlterField(
            model_name='userdetailsviewmodel',
            name='permissions',
            field=models.ManyToManyField(to='server.PermissionViewModel', blank=True, related_name='UserDetailsViewModelpermissions'),
        ),
        migrations.AlterField(
            model_name='userfavourite',
            name='User',
            field=models.ForeignKey(related_name='UserFavouriteUser', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='effectiveDate',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='expiryDate',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='role',
            field=models.ForeignKey(related_name='UserRolerole', null=True, to='server.Role', blank=True),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='user',
            field=models.ForeignKey(related_name='UserRoleuser', null=True, to='server.User', blank=True),
        ),
        migrations.AlterField(
            model_name='userroleviewmodel',
            name='effectiveDate',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='userroleviewmodel',
            name='expiryDate',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='userviewmodel',
            name='groupMemberships',
            field=models.ManyToManyField(to='server.GroupMembership', blank=True, related_name='UserViewModelgroupMemberships'),
        ),
        migrations.AlterField(
            model_name='userviewmodel',
            name='userRoles',
            field=models.ManyToManyField(to='server.UserRole', blank=True, related_name='UserViewModeluserRoles'),
        ),
        migrations.AddField(
            model_name='offer',
            name='fuelSupplier',
            field=models.ForeignKey(related_name='OfferfuelSupplier', null=True, to='server.FuelSupplier', blank=True),
        ),
        migrations.AddField(
            model_name='offer',
            name='history',
            field=models.ManyToManyField(to='server.History', blank=True, related_name='Offerhistory'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='offer',
            field=models.ForeignKey(related_name='CreditTradeoffer', null=True, to='server.Offer', blank=True),
        ),
        migrations.AddField(
            model_name='notificationevent',
            name='offer',
            field=models.ForeignKey(related_name='NotificationEventoffer', null=True, to='server.Offer', blank=True),
        ),
    ]
