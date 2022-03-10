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
# account別に単語情報を取得


@csrf_exempt
def UserPost(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        try:
            User.objects.create(displayName=data["displayName"], email=data["email"])
            print('success post user!!')
        except:
            print('Error in UserPost')

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.data, status=201)

@csrf_exempt
def MoviePost(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        # ！！serializers作成した瞬間にも作成されている
        # serializer = MovieSerializer(data=data)
        displayName = data["displayName"]
        u = User.objects.filter(displayName=displayName)
        print(f'{u} in MoviePost')
        saved_v = Movie.objects.filter(v=data["v"])
        try:
            print("len(saved_v)")
            print(len(saved_v))
            if len(saved_v) == 0 :
                m = Movie.objects.create(
                user=u[0], title=data["title"], v=data["v"])
                print('success post movie!!')
            else:
                return Response({'Word Not Found': 'Invalid Word Code.'}, status=status.HTTP_202_ACCEPTED)
                

        except:
            print('Error in MoviePost')
            
        # if serializer.is_valid():
        #     print("serializer.is_valid()")
        #     serializer.save()
        #     return JsonResponse(serializer.data, status=201)
        return JsonResponse({"movie": m}, status=201)
            



class MovieGet(APIView):
    serializer_class = MovieSerializer
    # userで識別するようにする
    lookup_url_kwarg = 'displayName'

    def get(self, request, format=None):
        dispalyName = request.GET.get(self.lookup_url_kwarg)
        print("call MovieGet")
        if dispalyName != None:
            user = User.objects.filter(displayName=dispalyName)
            if user:
                # json式にシリアライズ
                data = MovieSerializer(user[0].movie_set.all(), many=True).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Word Not Found': 'Invalid Word Code.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            movie = Movie.objects.all()
            serializer = MovieSerializer(movie, many=True)
            return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def WordPost(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = WordSerializer(data=data)
        m = Movie.objects.filter(v=data["v"])[0]
        try:
            Word.objects.create(movie=m, list_id=data["list_id"], word=data["word"])
            print('success post word!')
        except:
            print('Error in WordPost')
        
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.data, status=201)

class WordGet(APIView):
    serializer_class = WordSerializer
    lookup_url_kwarg = ('displayName','v')
    
    def get(self, request, format=None):
        displayName = request.GET.get(self.lookup_url_kwarg[0])
        v = request.GET.get(self.lookup_url_kwarg[1])
        if displayName != None:
            u = User.objects.filter(displayName=displayName)[0]
            movie = Movie.objects.filter(user=u, v=v)
            if movie:
                # data = WordSerializer(word[0]).data
                data = WordSerializer(movie[0].word_set.all(), many=True).data
                
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Word Not Found': 'Invalid Word Code.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'Word Not Found': 'Invalid Word Code.'}, status=status.HTTP_404_NOT_FOUND)
        

class GetYoutubeTranscript(APIView):
    serializer_class = WordSerializer
    lookup_url_kwarg = 'v'

    def get(self, request, format=None):
        # print("call GetYoutubeTranscript")
        v = request.GET.get(self.lookup_url_kwarg)
        transcript = YouTubeTranscriptApi.get_transcript(video_id=v)

        return Response(transcript, status=status.HTTP_200_OK)
