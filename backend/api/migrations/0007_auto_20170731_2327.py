# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20170728_2052'),
    ]

    operations = [
        migrations.CreateModel(
            name='CreditTradeHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('creditTradeUpdateTime', models.DateField()),
                ('newTradeEffectiveDate', models.DateField(blank=True, null=True)),
                ('newNumberOfCredits', models.IntegerField()),
                ('newFairMarketValuePerCredit', models.CharField(blank=True, max_length=255, null=True)),
                ('note', models.CharField(blank=True, max_length=4096, null=True)),
                ('isInternalHistoryRecord', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='CreditTradeStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('status', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField()),
                ('expirationDate', models.DateField(blank=True, null=True)),
                ('displayOrder', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='CreditTradeType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('type', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField()),
                ('expirationDate', models.DateField()),
                ('displayOrder', models.IntegerField()),
                ('isGovOnlyType', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierActionsType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('type', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField(blank=True, null=True)),
                ('expirationDate', models.DateField(blank=True, null=True)),
                ('displayOrder', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierAttachment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('fileName', models.CharField(blank=True, max_length=255, null=True)),
                ('fileLocation', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('complianceYear', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierAttachmentTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('tag', models.CharField(blank=True, max_length=100, null=True)),
                ('fuelSupplierAttachmentId', models.ForeignKey(related_name='FuelSupplierAttachmentTagfuelSupplierAttachmentId', to='api.FuelSupplierAttachment')),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierBalance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('validatedCredits', models.IntegerField()),
                ('encumberedCredits', models.IntegerField()),
                ('effectiveDate', models.DateField()),
                ('endDate', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierCCData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('commonClientOrgId', models.CharField(blank=True, max_length=255, null=True)),
                ('lastUpdatefromCommonClient', models.DateField()),
                ('name', models.CharField(max_length=255)),
                ('corporateAddressLine1', models.CharField(blank=True, max_length=255, null=True)),
                ('corporateAddressLine2', models.CharField(blank=True, max_length=255, null=True)),
                ('corporateAddressCity', models.CharField(blank=True, max_length=255, null=True)),
                ('corporateAddressPostalCode', models.CharField(blank=True, max_length=255, null=True)),
                ('corporateAddressProvince', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierContact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('givenName', models.CharField(blank=True, max_length=255, null=True)),
                ('surname', models.CharField(blank=True, max_length=255, null=True)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('notes', models.CharField(blank=True, max_length=255, null=True)),
                ('emailAddress', models.CharField(blank=True, max_length=255, null=True)),
                ('workPhoneNumber', models.CharField(blank=True, max_length=255, null=True)),
                ('mobilePhoneNumber', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierContactRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('roleId', models.ForeignKey(related_name='FuelSupplierContactRoleroleId', to='api.Role')),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('historyText', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('status', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField()),
                ('expirationDate', models.DateField(blank=True, null=True)),
                ('displayOrder', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplierType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('type', models.CharField(max_length=255)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField()),
                ('expirationDate', models.DateField()),
                ('displayOrder', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='NotificationType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('type', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField(blank=True, null=True)),
                ('expirationDate', models.DateField(blank=True, null=True)),
                ('displayOrder', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Opportunity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('numberOfCredits', models.IntegerField()),
                ('suggestedValuePerCredit', models.CharField(blank=True, max_length=255, null=True)),
                ('hasTradeNow', models.BooleanField()),
                ('numberOfViews', models.IntegerField()),
                ('datePosted', models.DateField(blank=True, null=True)),
                ('opportunityBackgroundNote', models.CharField(blank=True, max_length=255, null=True)),
                ('plainEnglishPhrase', models.CharField(max_length=255)),
                ('creditTradeTypeId', models.ForeignKey(related_name='OpportunitycreditTradeTypeId', to='api.CreditTradeType')),
            ],
        ),
        migrations.CreateModel(
            name='OpportunityHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('updateTime', models.DateField(blank=True, null=True)),
                ('newNumberOfCredits', models.IntegerField()),
                ('newProposedValuePerCredit', models.CharField(blank=True, max_length=255, null=True)),
                ('newTradeEffectiveDate', models.DateField(blank=True, null=True)),
                ('note', models.CharField(blank=True, max_length=4096, null=True)),
                ('creditTradeTypeId', models.ForeignKey(related_name='OpportunityHistorycreditTradeTypeId', to='api.CreditTradeType')),
                ('fuelSupplierTypeId', models.ForeignKey(related_name='OpportunityHistoryfuelSupplierTypeId', to='api.FuelSupplierType')),
                ('opportunityId', models.ForeignKey(related_name='OpportunityHistoryopportunityId', to='api.Opportunity')),
            ],
        ),
        migrations.CreateModel(
            name='OpportunityStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('status', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('effectiveDate', models.DateField()),
                ('expirationDate', models.DateField(blank=True, null=True)),
                ('displayOrder', models.IntegerField()),
            ],
        ),
        migrations.DeleteModel(
            name='CompliancePeriod',
        ),
        migrations.RemoveField(
            model_name='credittradelogentry',
            name='creditTrade',
        ),
        migrations.RemoveField(
            model_name='credittradelogentry',
            name='user',
        ),
        migrations.RemoveField(
            model_name='groupmembership',
            name='group',
        ),
        migrations.RemoveField(
            model_name='groupmembership',
            name='user',
        ),
        migrations.DeleteModel(
            name='LookupList',
        ),
        migrations.RemoveField(
            model_name='note',
            name='CREATE_USER',
        ),
        migrations.RemoveField(
            model_name='note',
            name='UPDATE_USER',
        ),
        migrations.RemoveField(
            model_name='offer',
            name='fuelSupplier',
        ),
        migrations.RemoveField(
            model_name='offer',
            name='history',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='smAuthorizationDirectory',
            new_name='authorizationDirectory',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='smUserId',
            new_name='userId',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='approvedRejectedBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='attachments',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='cancelledBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='fairMarketValuePrice',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='fuelSupplierBalanceBeforeTransaction',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='initiatorLastUpdateBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='notes',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='offer',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='respondentLastUpdatedBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='reviewedRejectedBy',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='status',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='tradeExecutionDate',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='transactionType',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='attachments',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='contacts',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='history',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='notes',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='primaryContact',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='status',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='event',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='user',
        ),
        migrations.RemoveField(
            model_name='notificationevent',
            name='creditTrade',
        ),
        migrations.RemoveField(
            model_name='notificationevent',
            name='offer',
        ),
        migrations.RemoveField(
            model_name='rolepermission',
            name='permission',
        ),
        migrations.RemoveField(
            model_name='rolepermission',
            name='role',
        ),
        migrations.RemoveField(
            model_name='user',
            name='initials',
        ),
        migrations.RemoveField(
            model_name='user',
            name='status',
        ),
        migrations.RemoveField(
            model_name='userfavourite',
            name='type',
        ),
        migrations.RemoveField(
            model_name='userfavourite',
            name='user',
        ),
        migrations.AddField(
            model_name='credittrade',
            name='fairMarketValuePerCredit',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='plainEnglishPhrase',
            field=models.CharField(default='plainEnglishPhrase', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='credittrade',
            name='tradeEffectiveDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='notificationEventId',
            field=models.ForeignKey(default=1, related_name='NotificationnotificationEventId', to='api.NotificationEvent'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='notification',
            name='userId',
            field=models.ForeignKey(default=1, related_name='NotificationuserId', to='api.User'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='notificationevent',
            name='creditTradeId',
            field=models.ForeignKey(blank=True, null=True, related_name='NotificationEventcreditTradeId', to='api.CreditTrade'),
        ),
        migrations.AddField(
            model_name='rolepermission',
            name='permissionId',
            field=models.ForeignKey(default=1, related_name='RolePermissionpermissionId', to='api.Permission'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='rolepermission',
            name='roleId',
            field=models.ForeignKey(default=1, related_name='RolePermissionroleId', to='api.Role'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='authorizationID',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='fuelSupplierId',
            field=models.ForeignKey(blank=True, null=True, related_name='UserfuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='userfavourite',
            name='context',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='userfavourite',
            name='userId',
            field=models.ForeignKey(default=1, related_name='UserFavouriteuserId', to='api.User'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='history',
            field=models.ManyToManyField(blank=True, to='api.CreditTradeHistory', related_name='CreditTradehistory'),
        ),
        migrations.DeleteModel(
            name='Attachment',
        ),
        migrations.DeleteModel(
            name='Contact',
        ),
        migrations.DeleteModel(
            name='CreditTradeLogEntry',
        ),
        migrations.DeleteModel(
            name='Group',
        ),
        migrations.DeleteModel(
            name='GroupMembership',
        ),
        migrations.DeleteModel(
            name='History',
        ),
        migrations.DeleteModel(
            name='Note',
        ),
        migrations.DeleteModel(
            name='Offer',
        ),
        migrations.AddField(
            model_name='opportunityhistory',
            name='userId',
            field=models.ForeignKey(related_name='OpportunityHistoryuserId', to='api.User'),
        ),
        migrations.AddField(
            model_name='opportunity',
            name='creditTrades',
            field=models.ManyToManyField(blank=True, to='api.CreditTrade', related_name='OpportunitycreditTrades'),
        ),
        migrations.AddField(
            model_name='opportunity',
            name='fuelSupplierId',
            field=models.ForeignKey(related_name='OpportunityfuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='opportunity',
            name='fuelSupplierTypeId',
            field=models.ForeignKey(related_name='OpportunityfuelSupplierTypeId', to='api.FuelSupplierType'),
        ),
        migrations.AddField(
            model_name='opportunity',
            name='opportunityStatusId',
            field=models.ForeignKey(related_name='OpportunityopportunityStatusId', to='api.OpportunityStatus'),
        ),
        migrations.AddField(
            model_name='fuelsupplierhistory',
            name='fuelSupplierId',
            field=models.ForeignKey(related_name='FuelSupplierHistoryfuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='fuelsuppliercontact',
            name='fuelSupplierId',
            field=models.ForeignKey(related_name='FuelSupplierContactfuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='fuelsuppliercontact',
            name='userId',
            field=models.ForeignKey(blank=True, null=True, related_name='FuelSupplierContactuserId', to='api.User'),
        ),
        migrations.AddField(
            model_name='fuelsupplierccdata',
            name='fuelSupplierId',
            field=models.ForeignKey(related_name='FuelSupplierCCDatafuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='fuelsupplierbalance',
            name='creditTradeId',
            field=models.ForeignKey(related_name='FuelSupplierBalancecreditTradeId', to='api.CreditTrade'),
        ),
        migrations.AddField(
            model_name='fuelsupplierbalance',
            name='fuelSupplierId',
            field=models.ForeignKey(related_name='FuelSupplierBalancefuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='fuelsupplierattachment',
            name='fuelSupplierId',
            field=models.ForeignKey(related_name='FuelSupplierAttachmentfuelSupplierId', to='api.FuelSupplier'),
        ),
        migrations.AddField(
            model_name='credittradehistory',
            name='creditTradeStatusId',
            field=models.ForeignKey(related_name='CreditTradeHistorycreditTradeStatusId', to='api.CreditTradeStatus'),
        ),
        migrations.AddField(
            model_name='credittradehistory',
            name='creditTradeTypeId',
            field=models.ForeignKey(related_name='CreditTradeHistorycreditTradeTypeId', to='api.CreditTradeType'),
        ),
        migrations.AddField(
            model_name='credittradehistory',
            name='userId',
            field=models.ForeignKey(related_name='CreditTradeHistoryuserId', to='api.User'),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='creditTradeStatusId',
            field=models.ForeignKey(default=1, related_name='CreditTradecreditTradeStatusId', to='api.CreditTradeStatus'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='credittrade',
            name='creditTradeTypeId',
            field=models.ForeignKey(default=1, related_name='CreditTradecreditTradeTypeId', to='api.CreditTradeType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='fuelSupplierActionsTypeId',
            field=models.ForeignKey(default=1, related_name='FuelSupplierfuelSupplierActionsTypeId', to='api.FuelSupplierActionsType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='fuelSupplierStatusId',
            field=models.ForeignKey(default=1, related_name='FuelSupplierfuelSupplierStatusId', to='api.FuelSupplierStatus'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='fuelSupplierTypeId',
            field=models.ForeignKey(default=1, related_name='FuelSupplierfuelSupplierTypeId', to='api.FuelSupplierType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='notificationevent',
            name='opportunityId',
            field=models.ForeignKey(blank=True, null=True, related_name='NotificationEventopportunityId', to='api.Opportunity'),
        ),
    ]
