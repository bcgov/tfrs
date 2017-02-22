import datetime

from django.db import models
from django.utils import timezone



class FuelClass(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
	
    class Meta:
        verbose_name_plural = "fuel classes"

		
class FuelType(models.Model):
    fuel_class = models.ForeignKey(FuelClass, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name


class FuelSupplier(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name


class FuelSupply(models.Model):
    fuel_supplier = models.ForeignKey(FuelSupplier, on_delete=models.CASCADE)
    fuel_type = models.ForeignKey(FuelType, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    supply_year = models.DateField('year')
    last_modified = models.DateField(auto_now=True)
#    def __str__(self):
#        return self.name + self.




