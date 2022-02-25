from django.urls import path
from .views import CategoryView, GetCategory, MovieView, SampleView,CreateMovieView,GetMovie,JoinMovie,UserInMovie,LeaveMovie,UpdateMovie


urlpatterns = [
    # path('sample/', SampleView),
    path('movie', MovieView.as_view()),
    path('category', CategoryView.as_view()),
    path('get-category', GetCategory.as_view()),
    path('create-movie', CreateMovieView.as_view()),
    path('get-movie', GetMovie.as_view()),
    path('join-movie', JoinMovie.as_view()),
    path('user-in-movie', UserInMovie.as_view()),
    path('leave-movie', LeaveMovie.as_view()),
    path('update-movie', UpdateMovie.as_view())

]