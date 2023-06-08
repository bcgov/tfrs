from django.db import models

class CachedPages(models.Model):
    cache_key = models.CharField(max_length=512, unique=True)
    value = models.TextField()
    expires = models.DateTimeField()
    class Meta:
        db_table = 'cached_pages'