from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers, status
from .serializers import MovieSerializer, WordSerializer, UserSerializer
from .models import Movie, Word, User
from rest_framework.views import APIView
from rest_framework.response import Response
from youtube_transcript_api import YouTubeTranscriptApi
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
# account別に単語情報を取得


@csrf_exempt
def user_api_view(request, displayName=""):
    err_msg = {
        "error": {
            "code": 404,
            "message": "User not found",
        }}
    if request.method == "GET":
        try:
            user = User.objects.get(displayName=displayName)
        except User.DoesNotExist:
            return HttpResponse("Not found User in user_api_view")
        return HttpResponse("Success find User in user_api_view")
        
    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def movie_api_view(request, displayName):
    err_msg = {
        "error": {  
            "code": 404,
            "message": "Movie not found",
        }}
    try:
        user = User.objects.get(displayName=displayName)
    except User.DoesNotExist:
        return HttpResponse("Not found User in movie_api_view")

    if request.method == "GET":
        try:
            movies = user.movie_set.all()
        except Movie.DoesNotExist:
            return HttpResponse("Not found Movies in movie_api_view")
        
        serializer = MovieSerializer(movies, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        v = data["v"]
        # pk渡さないといけない
        data["user"] = user.pk
        try:
            movies = Movie.objects.filter(v=v)
            if len(movies) == 0:
                # 存在しない場合に追加する
                serializer = MovieSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data)
                return JsonResponse(serializer.errors, status=400)
            else:
                # 存在した場合はGetと同様に値を返す
               serializer = MovieSerializer(movies, many=True)
            
        except Movie.DoesNotExist:
            # 初めてのmovieの場合の追加
            serializer = MovieSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        
        return JsonResponse(serializer.data, safe=False)
            
           
            


    # elif request.method == "DELETE":
    #     movie.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
def word_api_view(request, displayName, v=""):
    err_msg = {
        "error": {
            "code": 404,
            "message": "Movie not found",
        }}
    try:
        user = User.objects.get(displayName=displayName)
    except User.DoesNotExist:   
        return HttpResponse("Not found User in word_api_view")
    try:
        movie = Movie.objects.get(user=user, v=v)
    except Movie.DoesNotExist:
        # Wordに関してのみ，movieが存在しない場合があるので，返り値の文字列で，一旦条件分岐
        return HttpResponse("Not found Movie in word_api_view")
    

    if request.method == "GET":
        try:
            words = movie.word_set.all()
        except Word.DoesNotExist:
            return HttpResponse("Not found Word in word_api_view")
            
        serializer = WordSerializer(words, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        v = data["v"]
        data["movie"] = movie.pk
        serializer = WordSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    # elif request.method == "DELETE":
    #     movie.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
        

class GetYoutubeTranscript(APIView):
    serializer_class = WordSerializer
    lookup_url_kwarg = 'v'

    def get(self, request, format=None):
        v = request.GET.get(self.lookup_url_kwarg)
        transcript = YouTubeTranscriptApi.get_transcript(video_id=v)

        return Response(transcript, status=status.HTTP_200_OK)
