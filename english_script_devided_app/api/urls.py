from django.urls import path
from .views import CategoryView, GetCategory,MovieView, CreateMovieView,GetMovie,JoinMovie,UserInMovie,LeaveMovie,UpdateMovie, GetYoutubeTranscript, YoutubeWordGet, YoutubeWordKeyGet, YoutubeWordPost


urlpatterns = [
    path('movie', MovieView.as_view()),
    path('category', CategoryView.as_view()),
    path('get-category', GetCategory.as_view()),
    path('create-movie', CreateMovieView.as_view()),
    path('get-movie', GetMovie.as_view()),
    path('join-movie', JoinMovie.as_view()),
    path('user-in-movie', UserInMovie.as_view()),
    path('leave-movie', LeaveMovie.as_view()),
    path('update-movie', UpdateMovie.as_view()),
    path('get-youtube-transcript', GetYoutubeTranscript.as_view()),
    path('youtube-word-get', YoutubeWordGet.as_view()),
    path('youtube-word-key-get', YoutubeWordKeyGet.as_view()),
    path('youtube-word-post', YoutubeWordPost),

]