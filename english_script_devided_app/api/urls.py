from django.urls import path
from .views import GetYoutubeTranscript,  movie_api_view,user_api_view, word_api_view

urlpatterns = [
    path('get-youtube-transcript/', GetYoutubeTranscript.as_view()),
    path('user-get/<str:displayName>/', user_api_view),
    path('user-post/', user_api_view),
    path('movie-get/<str:displayName>/', movie_api_view),
    path('movie-post/<str:displayName>/', movie_api_view),
    path('movie-put/<str:displayName>/', movie_api_view),
    path('movie-delete/<str:displayName>/<str:v>/', movie_api_view),
    path('word-post/<str:displayName>/<str:v>/', word_api_view),
    path('word-get/<str:displayName>/<str:v>/', word_api_view),
]