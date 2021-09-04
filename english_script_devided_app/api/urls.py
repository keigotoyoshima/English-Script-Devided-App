from django.urls import path
from .views import MovieView, CreateMovieView,GetMovie,JoinMovie,UserInMovie,LeaveMovie,UpdateMovie


urlpatterns = [
    path('movie', MovieView.as_view()),
    path('create-movie', CreateMovieView.as_view()),
    path('get-movie', GetMovie.as_view()),
    path('join-movie', JoinMovie.as_view()),
    path('user-in-movie', UserInMovie.as_view()),
    path('leave-movie', LeaveMovie.as_view()),
    path('update-movie', UpdateMovie.as_view())

]