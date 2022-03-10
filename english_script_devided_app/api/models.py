from django.db import models
from django.urls import reverse_lazy


class User(models.Model):
    displayName = models.CharField(
        max_length=255,
        blank=False,
        null=False,
    )

    email = models.CharField(
        max_length=255,
        blank=False,
        null=True,
    )

    def __str__(self):
        return self.displayName

class Movie(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    
    # version1ではvを格納
    title = models.CharField(
        max_length=255,
        blank=False,
        null=True,
    )
    
    # youtube-API用key
    v = models.CharField(
        max_length=255,
        blank=False,
        null=True,
    )
    
    
    def __str__(self):
        return self.title
    
class Word(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, null=True)
    
    list_id = models.CharField(
        max_length=255,
        blank=False,
        null=False,
    )
    
    word = models.CharField(    
        max_length=255,
        blank=False,
        null=False,
    )

    def __str__(self):
        return self.word
    