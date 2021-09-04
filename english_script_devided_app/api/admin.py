from django.contrib import admin
from . import models



@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Movie)
class MovieAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Drama)
class DramaAdmin(admin.ModelAdmin):
    pass


@admin.register(models.DramaContent)
class DramaContentAdmin(admin.ModelAdmin):  
    pass