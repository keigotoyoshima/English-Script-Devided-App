from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers, status
from .serializers import MovieSerializer, WordSerializer, UserSerializer
from .models import MovieModel, WordModel, UserModel
from rest_framework.views import APIView
from rest_framework.response import Response
from youtube_transcript_api import YouTubeTranscriptApi
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
# account別に単語情報を取得
from django.contrib.auth.models import User
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType



@csrf_exempt
def user_api_view(request, displayName=""):
    err_msg = {
        "error": {
            "code": 404,
            "message": "User not found",
        }}
    if request.method == "GET":
        print("start get")
        try:
            user = UserModel.objects.get(displayName=displayName)
            print(f'{user} user')
        except UserModel.DoesNotExist:
            print(" UserModel.DoesNotExist:")
            return HttpResponse("Not found User in user_api_view")
        return HttpResponse("Success find User in user_api_view")
        
    elif request.method == "POST":
        data = JSONParser().parse(request)
        displayName = data["displayName"]
        email = data["email"]
        password = data["password"] 
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            # 権限user作成
            u = User.objects.create_user(displayName, email, password)
            content_movidemodel_type = ContentType.objects.get_for_model(MovieModel)
            content_wordmodel_type = ContentType.objects.get_for_model(WordModel)

            permission_moviemodel_list = ['change_moviemodel', 'delete_moviemodel']
            permission_wordmodel_list = ['change_wordmodel', 'delete_wordmodel']
            for permission in permission_moviemodel_list:
                perm = Permission.objects.get(
                    codename=permission,
                    content_type=content_movidemodel_type,
                )
                u.user_permissions.add(perm)
            
            for permission in permission_wordmodel_list:
                perm = Permission.objects.get(
                    codename=permission,
                    content_type=content_wordmodel_type,
                )
                u.user_permissions.add(perm)
            # userModel作成
            serializer.save()
            return JsonResponse(serializer.data)
        return HttpResponse("Fail post user")


@csrf_exempt
def movie_api_view(request, displayName, v=""):
    err_msg = {
        "error": {  
            "code": 404,
            "message": "Movie not found",
        }}
    try:
        user = UserModel.objects.get(displayName=displayName)

    except UserModel.DoesNotExist:
        return HttpResponse("Not found User in movie_api_view")

    if request.method == "GET":
        try:
            movies = user.moviemodel_set.all().order_by('created')
        except MovieModel.DoesNotExist:
            return HttpResponse("Not found Movies in movie_api_view")
        
        serializer = MovieSerializer(movies, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        v = data["v"]
        # pk渡さないといけない
        data["user"] = user.pk
        try:
            movies = MovieModel.objects.filter(v=v, user=user)
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
            
        except MovieModel.DoesNotExist:
            # 初めてのmovieの場合の追加
            serializer = MovieSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)
        
        return JsonResponse(serializer.data, safe=False)
    
    elif request.method == "PUT":
        data = JSONParser().parse(request)
        v = data["v"]
        # pk渡さないといけない
        data["user"] = user.pk
        try:
            movieModel = MovieModel.objects.get(v=v)
            serializer = MovieSerializer(movieModel,data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)

        except MovieModel.DoesNotExist:
            # 初めてのmovieの場合の追加
            serializer = MovieSerializer(data=data)
            return JsonResponse(serializer.errors, status=400)
            

    elif request.method == "DELETE":
        try:
            movie = user.moviemodel_set.all().get(v=v)
        except MovieModel.DoesNotExist:
            return HttpResponse("Not found Movies in movie_api_view")
        serializer = MovieSerializer(movie)
        movie.delete()
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def word_api_view(request, displayName, v=""):
    err_msg = {
        "error": {
            "code": 404,
            "message": "Movie not found",
        }}
    try:
        user = UserModel.objects.get(displayName=displayName)
    except UserModel.DoesNotExist:   
        return HttpResponse("Not found User in word_api_view")
    try:
        movie = MovieModel.objects.get(user=user, v=v)
    except MovieModel.DoesNotExist:
        # Wordに関してのみ，movieが存在しない場合があるので，返り値の文字列で，一旦条件分岐
        return HttpResponse("Not found Movie in word_api_view")
    

    if request.method == "GET":
        try:
            words = movie.wordmodel_set.all().order_by('created')
        except WordModel.DoesNotExist:
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
