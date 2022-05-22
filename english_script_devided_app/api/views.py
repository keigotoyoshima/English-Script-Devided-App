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

# http status code 定義

# 200(OK):特定できた時，dataに誤りがなかった時
# 204(No Content):特定できなかった時
# 400(Bad request):dataに誤りがあった時
# 404(Not Found):特定できないことがあってはならない時



@csrf_exempt
def user_api_view(request, displayName=""):
    if request.method == "GET":
        try:
            user = UserModel.objects.get(displayName=displayName)
        except UserModel.DoesNotExist:
            # ここはいなくても問題ないため204
            return HttpResponse(status=204)
        return HttpResponse(status=200)
        
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
            return JsonResponse(serializer.data, status=200)
        return HttpResponse(status=400)


@csrf_exempt
def movie_api_view(request, displayName, v=""):
    try:
        user = UserModel.objects.get(displayName=displayName)

    except UserModel.DoesNotExist:
        # いないことはあり得ないため，404
        return HttpResponse(status=404)

    if request.method == "GET":
        movies = user.moviemodel_set.all().order_by('created')
        
        serializer = MovieSerializer(movies, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        v = data["v"]
        # pk渡さないといけない
        data["user"] = user.pk
        # try:
        # movie追加が初めてじゃない場合
        movies = MovieModel.objects.filter(v=v, user=user)
        if len(movies) == 0:
            # 同一movieが存在しない場合に追加する
            serializer = MovieSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)
        else:
            # 同一mvoieが存在した場合はGetと同様に値を返す
            serializer = MovieSerializer(movies, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
               

    
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
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)

        except MovieModel.DoesNotExist:
            # あり得ないため，404
            return HttpResponse(status=404)
            

    elif request.method == "DELETE":
        try:
            movie = user.moviemodel_set.all().get(v=v)
        except MovieModel.DoesNotExist:
            # 不特定はあり得ないため，404
            return HttpResponse(status=404)
        serializer = MovieSerializer(movie)
        movie.delete()
        return JsonResponse(serializer.data, safe=False, status=200)

@csrf_exempt
def word_api_view(request, displayName, v=""):
    try:
        user = UserModel.objects.get(displayName=displayName)
    except UserModel.DoesNotExist:   
        # 不特定はあり得ないため，404
        return HttpResponse(status=404)
    try:
        movie = MovieModel.objects.get(user=user, v=v)
    except MovieModel.DoesNotExist:
        # 不特定はあり得ないため，404
        return HttpResponse(status=404)
    

    if request.method == "GET":
        words = movie.wordmodel_set.all().order_by('created')
            
        serializer = WordSerializer(words, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == "POST":
        data = JSONParser().parse(request)
        v = data["v"]
        data["movie"] = movie.pk
        serializer = WordSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
        

class GetYoutubeTranscript(APIView):
    serializer_class = WordSerializer
    lookup_url_kwarg = 'v'

    def get(self, request, format=None):
        v = request.GET.get(self.lookup_url_kwarg)
        transcript = YouTubeTranscriptApi.get_transcript(video_id=v)

        return Response(transcript, status=status.HTTP_200_OK)
