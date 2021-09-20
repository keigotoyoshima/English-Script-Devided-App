from rest_framework import serializers
from .models import Category, Movie

class MovieSerializer(serializers.ModelSerializer):
  class Meta:
    model = Movie
    fields = ('__all__')

class CreateMovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('title',)


class UpdateMovieSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    class Meta:
        model = Movie
        fields = ('title')
# about Category
class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields = ('__all__')