from django.db import models
from django.urls import reverse_lazy

class Category(models.Model):
    category = models.CharField(
        max_length=255,
        blank=False,
        null=True,
    )

    def __str__(self):
        return self.category



class Movie(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)

    created = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        blank=False,
        null=False)
    
    updated = models.DateTimeField(
        auto_now=True,
        editable=False,
        blank=False,
        null=False)

        
    title = models.CharField(
        max_length=255,
        blank=False,
        null=False)
    
    duration = models.IntegerField(
        verbose_name='duration',
        blank=True,
        null=True,
        default=0,
    )

    capture1 = models.TextField(
        blank=True,
        null=False        
    )
    capture2 = models.TextField(
        blank=True,
        null=False        
    )
    capture3 = models.TextField(
        blank=True,
        null=False        
    )
    capture4 = models.TextField(
        blank=True,
        null=False        
    )
    capture5 = models.TextField(
        blank=True,
        null=False        
    )
    capture6 = models.TextField(
        blank=True,
        null=False        
    )
    capture7 = models.TextField(
        blank=True,
        null=False        
    )
    capture8 = models.TextField(
        blank=True,
        null=False        
    )
    capture9 = models.TextField(
        blank=True,
        null=False        
    )
    capture10 = models.TextField(
        blank=True,
        null=False        
    )
    capture11 = models.TextField(
        blank=True,
        null=False        
    )
    capture12 = models.TextField(
        blank=True,
        null=False        
    )
    capture13 = models.TextField(
        blank=True,
        null=False        
    )
    capture14 = models.TextField(
        blank=True,
        null=False        
    )
    capture15 = models.TextField(
        blank=True,
        null=False        
    )

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse_lazy("polls:index") 



class Drama(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)

    created = models.DateTimeField(
        auto_now_add=True,  
        editable=False,
        blank=False,
        null=False)
    
    updated = models.DateTimeField(
        auto_now=True,
        editable=False,
        blank=False,
        null=False)

    title = models.CharField(
        max_length=255,
        blank=False,    
        null=False)   

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse_lazy("polls:createDramaContent") 

class DramaContent(models.Model):
    drama = models.ForeignKey(Drama, on_delete=models.CASCADE,related_name='dramaContent', blank=False
    )   

    duration = models.IntegerField(
        verbose_name='duration',
        blank=True,
        null=True,
        default=0,
    )

    season = models.IntegerField(
        verbose_name='season',
        blank=True,
        null=True,
        default=0,
    )

    episode = models.IntegerField(
        verbose_name='episode',
        blank=True,
        null=True,
        default=0,
    )

    capture1 = models.TextField(
        blank=True,
        null=False        
    )
    capture2 = models.TextField(
        blank=True,
        null=False        
    )
    capture3 = models.TextField(
        blank=True,
        null=False        
    )
    capture4 = models.TextField(
        blank=True,
        null=False        
    )
    capture5 = models.TextField(
        blank=True,
        null=False        
    )
    capture6 = models.TextField(
        blank=True,
        null=False        
    )
    capture7 = models.TextField(
        blank=True,
        null=False        
    )
    capture8 = models.TextField(
        blank=True,
        null=False        
    )

    


    def get_absolute_url(self):
        return reverse_lazy("polls:index")

