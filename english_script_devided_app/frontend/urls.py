from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('movie/<int:id>', index),  
    # path('movie', index),
    path('drama', index),
    # path('room/<str:roomCode>', index)
]