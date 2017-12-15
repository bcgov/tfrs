# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FuelClass',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupplier',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='FuelSupply',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('quantity', models.IntegerField()),
                ('supply_year', models.DateField(verbose_name='year')),
                ('last_modified', models.DateField(auto_now=True)),
                ('fuel_supplier', models.ForeignKey(to='api.FuelSupplier')),
            ],
        ),
        migrations.CreateModel(
            name='FuelType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('name', models.CharField(max_length=100)),
                ('fuel_class', models.ForeignKey(to='api.FuelClass')),
            ],
        ),
        migrations.AddField(
            model_name='fuelsupply',
            name='fuel_type',
            field=models.ForeignKey(to='api.FuelType'),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('givenName', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('initials', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('status', models.CharField(max_length=255)),
                ('smUserId', models.CharField(max_length=255)),
                ('guid', models.CharField(max_length=255)),
                ('smAuthorizationDirectory', models.CharField(max_length=255)),
            ],
        ),
    ]
