import json
from django.test import TestCase
from api.models import *
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.models import Permission

# class UserModelTests(TestCase):
#   factory = APIRequestFactory()
  
#   def test_user_api(self):
#     response = self.factory.post(
#         '/api/user-post', {'displayName': 'testUser', 'email': 'testUser@example.com'})
    # self.assertEqual(UserModel.objects.count(), 1)
    # # self.assertEqual(response.status_code, 200)
    # self.assertEqual(UserModel.objects.get().name, 'testUser')
    # self.assertEqual(UserModel.objects.get().email, 'testUser@example.com')


class RestfulApiTests(APITestCase):
    def test_restful_api(self):
        
    #-----------------
    
        # about UserModel
        # post-test
        url = "/api/user-post/"
        test_data = {'displayName': 'testUser',
                     'email': 'testUser@example.com', 'password': 'testPassword'}
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserModel.objects.count(), 1)
        self.assertEqual(UserModel.objects.get().displayName, 'testUser')
        self.assertEqual(UserModel.objects.get().email, 'testUser@example.com')
        
        # permissions-test
        self.assertEqual(User.objects.get().has_perm('api.change_moviemodel'), True)
        self.assertEqual(User.objects.get().has_perm('api.delete_moviemodel'), True)
        self.assertEqual(User.objects.get().has_perm('api.change_wordmodel'), True)
        self.assertEqual(User.objects.get().has_perm('api.delete_wordmodel'), True)
        
        # get-test
        url = "/api/user-get/testUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
    
    #-----------------

        # about MovieModel
        test_data = {
            'title': "testTitle",
            'v': 'testVideoId',
        }
        
        # get-test
        url = "/api/movie-get/testUser/"
        response = self.client.get(url)
        self.assertEqual(MovieModel.objects.count(), 0)

        
        
        # post-test
        url = "/api/movie-post/testUser/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 1)
        self.assertEqual(MovieModel.objects.get().user.pk, 1)
        self.assertEqual(MovieModel.objects.get().title, 'testTitle')
        self.assertEqual(MovieModel.objects.get().v, 'testVideoId')

        
        # get-test
        url = "/api/movie-get/testUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data[0]["title"], "testTitle")
        self.assertEqual(json_data[0]["user"], 1)
        self.assertEqual(json_data[0]["v"], "testVideoId")


        # put-test
        new_test_data = {
            'title': "newTestTitle",
            'v': 'testVideoId',
        }
        url = "/api/movie-put/testUser/"
        response = self.client.put(url, new_test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 1)
        self.assertEqual(MovieModel.objects.get().user.pk, 1)
        self.assertEqual(MovieModel.objects.get().title, 'newTestTitle')
        self.assertEqual(MovieModel.objects.get().v, 'testVideoId')
        
        
        
        # delete-test
        url = "/api/movie-delete/testUser/testVideoId/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 0)
        
        
        
    #-----------------
    
        # about WordModel
        # movie作成
        url = "/api/movie-post/testUser/"
        response = self.client.post(url, test_data, format='json')
        
        test_data = {
            'word': 'testWord',
            'list_id': "2",
            'v': 'testVideoId',
        }   
        
        # post-test
        url = "/api/word-post/testUser/testVideoId/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(WordModel.objects.count(), 1)
        self.assertEqual(WordModel.objects.get().movie.pk, 2)
        self.assertEqual(WordModel.objects.get().word, 'testWord')
        self.assertEqual(WordModel.objects.get().list_id, "2")

        
        # get-test
        url = "/api/word-get/testUser/testVideoId/"
        response = self.client.get(url)
        json_data = response.json()
        print(f'{json_data} json_data')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_data[0]["word"], "testWord")
        self.assertEqual(json_data[0]["list_id"], "2")
        self.assertEqual(json_data[0]["movie"], 2)

        
        

        


        