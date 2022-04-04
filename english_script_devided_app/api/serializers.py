from rest_framework import serializers
from .models import MovieModel, WordModel, UserModel


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = ('__all__')


class MovieSerializer(serializers.ModelSerializer):
  class Meta:
    model = MovieModel
    fields = ('__all__')

class WordSerializer(serializers.ModelSerializer):
  class Meta:
    model = WordModel
    fields = ('__all__')

