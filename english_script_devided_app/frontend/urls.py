from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('movie/<int:id>', index),  
    path('drama', index),
    path('youtube', index),
]