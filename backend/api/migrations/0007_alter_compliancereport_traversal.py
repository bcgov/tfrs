# Generated by Django 3.2.20 on 2023-07-17 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20230704_2341'),
    ]

    operations = [
        migrations.AlterField(
            model_name='compliancereport',
            name='traversal',
            field=models.IntegerField(default=1),
        ),
        migrations.RunSQL("UPDATE compliance_report  SET traversal = traversal + 1;",
            reverse_sql="UPDATE compliance_report SET traversal = traversal - 1;"
        )
    ]
