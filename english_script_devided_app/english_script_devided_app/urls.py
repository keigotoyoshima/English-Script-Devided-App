
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from api.admin import mypage_site

from django.contrib.auth.models import Group

admin.site.site_title = 'Manage My page'
admin.site.site_header = 'Manage My page'
admin.site.index_title = 'Menu'
# admin.site.unregister(Group)
# admin.site.disable_action('delete_selected')


urlpatterns = [
    # path('admin/', admin.site.urls),
    path('manage/', admin.site.urls),
    path('mypage/', mypage_site.urls),
    path('api/', include('api.urls')),
    path('', include('frontend.urls')),
]
