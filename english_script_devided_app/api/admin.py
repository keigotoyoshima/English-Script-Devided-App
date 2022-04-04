from django.contrib.admin import AdminSite
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import admin
from . import models
from api.models import UserModel, MovieModel, WordModel


@admin.register(models.WordModel)
class WordAdmin(admin.ModelAdmin):
    list_display = ['word', 'created', 'updated']
    readonly_fields = ['movie']
    list_select_related = ['movie'] 
    ordering = ['-created']
    # manytomany
    list_filter = ['movie']
    
    def get_queryset(self, request):
        displayName = request.user.username
        qs = super(WordAdmin, self).get_queryset(request)
        try:
            userModel = UserModel.objects.get(displayName=displayName)
        except UserModel.DoesNotExist:
            print("Not found User in WordAdmin")
        try:   
            movieModel = MovieModel.objects.filter(user=userModel)
            for m in movieModel:
                q = m.wordmodel_set.all()
                print(f'{q} q')
                qs = qs | q


        except MovieModel.DoesNotExist:
            # Wordに関してのみ，movieが存在しない場合がある
            return print("Not found Movie in WordAdmin")
        
        return qs



@admin.register(models.MovieModel)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'created', 'updated']
    readonly_fields = ['v']
    # N+1問題回避
    # list_editable = ['title']
    # list_display_links = ['title']
    ordering = ['-created']
    # list_filter = []
    
    def get_queryset(self, request):
        displayName = request.user.username
        qs = super(MovieAdmin, self).get_queryset(request)
        try:
            userModel = UserModel.objects.get(displayName=displayName)
            qs = qs.filter(user=userModel)
        except UserModel.DoesNotExist:
            print("Not found User in MovieAdmin")
    
        return qs
        


@admin.register(models.UserModel)
class UserAdmin(admin.ModelAdmin):
    pass


class adminSite(AdminSite):
    site_header = 'My Page'
    site_title = 'My Page'
    index_title = 'Home'
    login_form = AuthenticationForm

    def has_permission(self, request, ):
        return request.user.is_active


mypage_site = adminSite(name="mypage")

mypage_site.register(models.WordModel, WordAdmin)
mypage_site.register(models.MovieModel, MovieAdmin)
