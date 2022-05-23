from django.db import models
from django.urls import reverse_lazy


class UserModel(models.Model):
    created = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        blank=False,
        null=False
    )

    updated = models.DateTimeField(
        auto_now=True,
        editable=False,
        blank=False,
        null=False,
    )
    
    displayName = models.CharField(
        default="default",
        max_length=255,
        blank=False,
        null=False,
    )

    def __str__(self):
        return self.displayName

class MovieModel(models.Model):
    created = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        blank=False,
        null=False
    )

    updated = models.DateTimeField(
        auto_now=True,
        editable=False,
        blank=False,
        null=False,
    )
    
    user = models.ForeignKey(
        UserModel, 
        on_delete=models.CASCADE, 
        default=0,
        null=False,
    )
    
    # version1ではvを格納
    title = models.CharField(
        default="default",
        max_length=255,
        blank=False,
        null=False,
    )
    
    # youtube-API用key
    v = models.CharField(
        default="default",
        max_length=255,
        blank=False,
        null=False,
    )
    
    
    def __str__(self):
        return self.title
    
class WordModel(models.Model):
    created = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        blank=False,
        null=False
    )

    updated = models.DateTimeField(
        auto_now=True,
        editable=False,
        blank=False,
        null=False,
    )
    
    movie = models.ForeignKey(
        MovieModel, 
        on_delete=models.CASCADE, 
        null=True
    )
    
    list_id = models.CharField(
        default="default",
        max_length=255,
        blank=False,
        null=False,
    )
    
    word = models.CharField(    
        default="default",
        max_length=255,
        blank=False,
        null=False,
    )

    def __str__(self):
        return self.word
    