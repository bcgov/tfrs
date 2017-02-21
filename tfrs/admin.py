from django.contrib import admin

from .models import FuelSupplier, FuelClass, FuelType



admin.site.register(FuelSupplier)
admin.site.register(FuelClass)
admin.site.register(FuelType)
