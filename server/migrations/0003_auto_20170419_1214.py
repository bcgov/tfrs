# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_auto_20170214_1526'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('fileName', models.CharField(max_length=255)),
                ('fileContents', models.BinaryField()),
                ('description', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
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
            name='History',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('historyText', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('noteText', models.CharField(max_length=255)),
                ('isNoLongerRelevant', models.BooleanField()),
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
            field=models.DateField(default=datetime.datetime(2017, 4, 19, 19, 13, 46, 869240, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='status',
            field=models.CharField(default='', max_length=255),
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
            model_name='fuelsupplier',
            name='attachments',
            field=models.ManyToManyField(to='tfrs.Attachment', related_name='attachmentsAttachment'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='contacts',
            field=models.ManyToManyField(to='tfrs.Contact', related_name='contactsContact'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='history',
            field=models.ManyToManyField(to='tfrs.History', related_name='historyHistory'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='notes',
            field=models.ManyToManyField(to='tfrs.Note', related_name='notesNote'),
        ),
        migrations.AddField(
            model_name='fuelsupplier',
            name='primaryContact',
            field=models.ForeignKey(default=1, to='tfrs.Contact', related_name='primaryContactContact'),
            preserve_default=False,
        ),
    ]
