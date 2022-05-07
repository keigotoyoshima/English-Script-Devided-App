import json
from django.test import TestCase
from api.models import *
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.models import Permission


# テスト項目(statusコードについて)
# 200(OK):特定できた時，dataに誤りがなかった時
# 204(No Content):特定できなかった時
# 400(Bad request):dataに誤りがあった時
# 404(Not Found):特定できないことがあってはならない時

# ----------------------

# about user(post/get)
# 200
# signUp時のuser-post(正常値)
# signIn時のuser-get(登録済みのユーザー情報取得)

# 204
# signUp時のuser-get(初回は登録済みか判断する必要がある)

# 400
# signUp時のuser-post(異常値)

# ----------------------

# about movie(post/get/put/delete)
# 200
# movie-post(正常値,1回目)
# movie-post(正常値,２回目以降)
# movie-get(1回目)
# movie-get(２回目以降)
# movie-put(正常値)
# movie-delete(正常値)


# 400
# movie-post(非正常値)
# movie-put(非正常値)
# movie-delete(非正常値)


# 404
# 登録していないuserの時(get)
# 登録していないuserの時(post)
# 登録していないuserの時(put)
# 登録していないuserの時(delete)


# ----------------------

# about word(post/get)
# 200
# word-post(正常値)
# word-get(なにもない時)
# word-get(一個以上ある時)


# 400
# word-post(非正常値)


# 404
# 登録していないuserの時(post)
# 登録していないuserの時(get)
# video-idが指定されていないor 誤っていた時


class RestfulApiTests(APITestCase):
    def test_restful_api(self):

        # -----------------

        # about UserModel
        # post-test
        url = "/api/user-post/"
        test_data = {'displayName': 'testUser',
                     'email': 'testUser@example.com', 'password': 'testPassword'}
        bad_test_data = {
                        'displayName': 'testUser',
                         'email': 'testUser@example.com', 'password': 'testPassword'}
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserModel.objects.count(), 1)
        self.assertEqual(UserModel.objects.get().displayName, 'testUser')
        # self.assertEqual(UserModel.objects.get().email, 'testUser@example.com')
        
        # response = self.client.post(url)
        # self.assertEqual(response.status_code, 400)
        # self.assertEqual(UserModel.objects.count(), 1)

        # permissions-test
        self.assertEqual(User.objects.get().has_perm(
            'api.change_moviemodel'), True)
        self.assertEqual(User.objects.get().has_perm(
            'api.delete_moviemodel'), True)
        self.assertEqual(User.objects.get().has_perm(
            'api.change_wordmodel'), True)
        self.assertEqual(User.objects.get().has_perm(
            'api.delete_wordmodel'), True)

        # get-test
        # 登録済みuserで
        url = "/api/user-get/testUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # 未登録userで
        url = "/api/user-get/noneUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 204)
        

    # -----------------

        # about MovieModel
        test_data = {
            'title': "testTitle",
            'v': 'testVideoId',
        }
        
        bad_test_data = {
            'v': 'badTestVideoId',
        }
        

        # get-test(初回登録時)
        url = "/api/movie-get/testUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 0)
        # get-test(未登録user)
        url = "/api/movie-get/BadTestUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(MovieModel.objects.count(), 0)
        
        # post-test(非正常値)-modelでblanck=falseに変更したい-
        # url = "/api/movie-post/testUser/"
        # response = self.client.post(url, bad_test_data, format='json')
        # self.assertEqual(response.status_code, 400)
        # self.assertEqual(MovieModel.objects.count(), 1)
        # self.assertEqual(MovieModel.objects.get().user.pk, 1)
        # self.assertEqual(MovieModel.objects.get().title, 'testTitle')
        # self.assertEqual(MovieModel.objects.get().v, 'testVideoId')
        # post-test(正常値)
        url = "/api/movie-post/testUser/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 1)
        self.assertEqual(MovieModel.objects.get().user.pk, 1)
        self.assertEqual(MovieModel.objects.get().title, 'testTitle')
        self.assertEqual(MovieModel.objects.get().v, 'testVideoId')
        # ２回目以降(重複不可なので変わらない)
        url = "/api/movie-post/testUser/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 1)
        self.assertEqual(MovieModel.objects.get().user.pk, 1)
        self.assertEqual(MovieModel.objects.get().title, 'testTitle')
        self.assertEqual(MovieModel.objects.get().v, 'testVideoId')
        # post-test(未登録user)
        url = "/api/movie-post/BadTestUser/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 404)
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
        bad_new_test_data = {
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
        url = "/api/movie-put/BadTestUser/"
        response = self.client.put(url, new_test_data, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(MovieModel.objects.count(), 1)
        self.assertEqual(MovieModel.objects.get().user.pk, 1)
        self.assertEqual(MovieModel.objects.get().title, 'newTestTitle')
        self.assertEqual(MovieModel.objects.get().v, 'testVideoId')
        # put-test(非正常値)-modelでblanck=falseに変更したい-
        url = "/api/movie-put/testUser/"
        # response = self.client.put(url, bad_new_test_data, format='json')
        # self.assertEqual(response.status_code, 400)
        # self.assertEqual(MovieModel.objects.count(), 1)
        # self.assertEqual(MovieModel.objects.get().user.pk, 1)
        # self.assertEqual(MovieModel.objects.get().title, 'newTestTitle')
        # self.assertEqual(MovieModel.objects.get().v, 'testVideoId')

        # delete-test(非正常値)-modelでblanck=falseに変更したい-
        # url = "/api/movie-delete/testUser/BadTestVideoId/"
        # response = self.client.delete(url)
        # self.assertEqual(response.status_code, 400)
        # self.assertEqual(MovieModel.objects.count(), 1)
        # delete-test(非登録user)
        url = "/api/movie-delete/BadTestUser/testVideoId/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(MovieModel.objects.count(), 1)
        # delete-test
        url = "/api/movie-delete/testUser/testVideoId/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MovieModel.objects.count(), 0)
        

        

    # -----------------

        # about WordModel
        # movie作成
        url = "/api/movie-post/testUser/"
        response = self.client.post(url, test_data, format='json')

        test_data = {
            'word': 'testWord',
            'list_id': "2",
            'v': 'testVideoId',
        }
        
        bad_test_data = {
            'list_id': "2",
            'v': 'testVideoId',
        }

        
        # get-test(なにもない時)
        url = "/api/word-get/testUser/testVideoId/"
        response = self.client.get(url)
        json_data = response.json()
        self.assertEqual(response.status_code, 200)
        
        # post-test
        url = "/api/word-post/testUser/testVideoId/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(WordModel.objects.count(), 1)
        self.assertEqual(WordModel.objects.get().movie.pk, 2)
        self.assertEqual(WordModel.objects.get().word, 'testWord')
        self.assertEqual(WordModel.objects.get().list_id, "2")
        # post-test(非正常値)-modelでblanck=falseに変更したい-
        # url = "/api/word-post/testUser/testVideoId/"
        # response = self.client.post(url, bad_test_data, format='json')
        # self.assertEqual(response.status_code, 400)
        # self.assertEqual(WordModel.objects.count(), 1)
        # self.assertEqual(WordModel.objects.get().movie.pk, 2)
        # self.assertEqual(WordModel.objects.get().word, 'testWord')
        # self.assertEqual(WordModel.objects.get().list_id, "2")
        
        # post-test(非登録user)
        url = "/api/word-post/BadTestUser/testVideoId/"
        response = self.client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(WordModel.objects.count(), 1)
        self.assertEqual(WordModel.objects.get().movie.pk, 2)
        self.assertEqual(WordModel.objects.get().word, 'testWord')
        self.assertEqual(WordModel.objects.get().list_id, "2")

        # get-test
        url = "/api/word-get/testUser/testVideoId/"
        response = self.client.get(url)
        json_data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_data[0]["word"], "testWord")
        self.assertEqual(json_data[0]["list_id"], "2")
        self.assertEqual(json_data[0]["movie"], 2)
        # get-test(非登録user)
        url = "/api/word-get/BadTestUser/testVideoId/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        # get-test(video-idが指定されていない時)
        url = "/api/word-get/testUser/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        # get-test(video-idが誤っていた時)
        url = "/api/word-get/testUser/BadtestVideoId/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

