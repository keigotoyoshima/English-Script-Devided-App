from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers, status
from .serializers import MovieSerializer, CreateMovieSerializer, UpdateMovieSerializer,CategorySerializer
from .models import Category, Movie
from rest_framework.views import APIView
from rest_framework.response import Response
from youtube_transcript_api import YouTubeTranscriptApi

class GetYoutube(APIView):
    serializer_class = MovieSerializer
#     # lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        print("call GetYoutube")
        transcript = YouTubeTranscriptApi.get_transcript("O6P86uwfdR0")
        # print(transcript)
        
        # movie = Movie.objects.filter(id=1)

        # data = MovieSerializer(movie[0]).data
        # print(data)
        

        return Response(transcript, status=status.HTTP_200_OK)
#         # id = request.GET.get(self.lookup_url_kwarg)
#         # print("call GetMovie")
#         # if id != None:
#         #     movie = Movie.objects.filter(id=id)
#         #     if len(movie) > 0:
#         #         data = MovieSerializer(movie[0]).data
#         #         # print(f'{data=}')
#         #         # data['is_host'] = self.request.session.session_key == movie[0].host
#         #         return Response(data, status=status.HTTP_200_OK)
#         #     return Response({'Movie Not Found': 'Invalid Movie Code.'}, status=status.HTTP_404_NOT_FOUND)

#         # return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
class MovieView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class GetMovie(APIView):
    serializer_class = MovieSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        print("call GetMovie")
        if id != None:
            movie = Movie.objects.filter(id=id)
            if len(movie) > 0:
                data = MovieSerializer(movie[0]).data
                # print(f'{data=}')
                # data['is_host'] = self.request.session.session_key == movie[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Movie Not Found': 'Invalid Movie Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinMovie(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.GET.get(self.lookup_url_kwarg)

        if code != None:
            movie_result = Movie.objects.filter(code=code)
            if len(movie_result) > 0:
                movie = movie_result[0]
                self.request.session['movie_code'] = code
                return Response({'message': 'Movie Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Movie Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateMovieView(APIView):
    serializer_class = CreateMovieSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            print('there is not sessionkey')
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Movie.objects.filter(host=host)
            if queryset.exists():
                movie = queryset[0]
                movie.guest_can_pause = guest_can_pause
                movie.votes_to_skip = votes_to_skip
                movie.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['movie_code'] = movie.code
                return Response(MovieSerializer(movie).data, status=status.HTTP_200_OK)
            else:
                movie = Movie(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                movie.save()
                self.request.session['movie_code'] = movie.code
                return Response(MovieSerializer(movie).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInMovie(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('movie_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)



class LeaveMovie(APIView):
    def post(self, request, format=None):
        if 'movie_code' in self.request.session:
            self.request.session.pop('movie_code')
            host_id = self.request.session.session_key
            movie_results = Movie.objects.filter(host=host_id)
            if len(movie_results) > 0:
                movie = movie_results[0]
                movie.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


class UpdateMovie(APIView):
    serializer_class = UpdateMovieSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Movie.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)

            movie = queryset[0]
            user_id = self.request.session.session_key
            if movie.host != user_id:
                return Response({'msg': 'You are not the host of this movie.'}, status=status.HTTP_403_FORBIDDEN)

            movie.guest_can_pause = guest_can_pause
            movie.votes_to_skip = votes_to_skip
            movie.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(MovieSerializer(movie).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)


# about Category
class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class GetCategory(APIView):
    serializer_class = CategorySerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            category = Category.objects.filter(id=id)
            if len(category) > 0:
                data = CategorySerializer(category[0]).data
                # data['is_host'] = self.request.session.session_key == category[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Category Not Found': 'Invalid Category Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

