from django.urls import path
from .views import GetYoutubeTranscript, MovieGet, MoviePost, WordGet, WordPost, UserPost


urlpatterns = [
    path('get-youtube-transcript', GetYoutubeTranscript.as_view()),
    path('user-post', UserPost),
    path('word-get', WordGet.as_view()),
    path('word-post', WordPost),
    path('movie-get', MovieGet.as_view()),
    path('movie-post', MoviePost),
]