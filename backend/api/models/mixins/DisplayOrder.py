from django.db import models


class DisplayOrder(models.Model):
    display_order = models.IntegerField(
        db_comment='Relative rank in display sorting order')

    class Meta:
        abstract = True