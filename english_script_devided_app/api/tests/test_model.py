from django.test import TestCase
from api.models import *


class UserModelTests(TestCase):
  def test_is_empty(self):
    record = UserModel.objects.all()
    self.assertEqual(record.count(), 0)

  def test_get_fields(self):
    # < ManyToOneRel: api.moviemodel > , < django.db.models.fields.BigAutoField: id > , < django.db.models.fields.DateTimeField: created > , < django.db.models.fields.DateTimeField: updated > , < django.db.models.fields.CharField: displayName > , < django.db.models.fields.CharField: email > 
    self.assertEqual(len(UserModel._meta.get_fields()), 6)
    

class MovieModelTests(TestCase):
  def test_is_empty(self):
    record = MovieModel.objects.all()
    self.assertEqual(record.count(), 0)

  def test_get_fields(self):
    self.assertEqual(len(MovieModel._meta.get_fields()), 7)


class WordModelTests(TestCase):
  def test_is_empty(self):
    record = WordModel.objects.all()
    self.assertEqual(record.count(), 0)
  
  def test_get_fields(self):
    self.assertEqual(len(WordModel._meta.get_fields()), 6)
