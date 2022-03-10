from rest_framework import serializers
from .models import Movie, Word, User


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('__all__')


class MovieSerializer(serializers.ModelSerializer):
  class Meta:
    model = Movie
    fields = ('__all__')

class WordSerializer(serializers.ModelSerializer):
  class Meta:
    model = Word
    fields = ('__all__')

