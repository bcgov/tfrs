from django.db import models

# Create your models here.
from django.conf import settings

class Auditable(models.Model):
    create_timestamp = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    create_user = models.ForeignKey('User', related_name='%(app_label)s_%(class)s_CREATE_USER', blank=True, null=True)

    update_timestamp = models.DateTimeField(auto_now = True, blank=True, null=True)
    update_user = models.ForeignKey('User', related_name='%(app_label)s_%(class)s_UPDATE_USER', blank=True, null=True)

    class Meta:
        abstract = True
