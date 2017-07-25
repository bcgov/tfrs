from django.db import models

# Create your models here.
from django.conf import settings


class Auditable(models.Model):
    CREATE_DATE = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    CREATE_USER = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='CREATE_USER', blank=True, null=True)

    UPDATE_DATE = models.DateTimeField(auto_now = True, blank=True, null=True)
    UPDATE_USER = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='UPDATE_USER', blank=True, null=True)

    class Meta:
        abstract = True