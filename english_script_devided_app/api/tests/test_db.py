# from django.test import TestCase
# from django_test_migrations.migrator import Migrator
# from api.models import *

# class MigrationTests(TestCase):
#   migrator = Migrator(database='default')
#   old_state = migrator.apply_initial_migration(('api', '0001_initial'))
#   UserModel = old_state.apps.get_model('api', 'UserModel')
#   UserModel.objects.create(displayName='testUser',email='testUser@example.com')
#   assert len(UserModel._meta.get_fields()) == 5  # id + created + updated + displayName + email

#   new_state = migrator.apply_tested_migration(
#       ('main_app', '0002_someitem_is_clean'),
#   )
#   UserModel = new_state.apps.get_model('main_app', 'UserModel')

#   # We can now test how our migration worked, new field is there:
#   assert UserModel.objects.filter(is_clean=True).count() == 0
#   assert len(UserModel._meta.get_fields()) == 3  # id + string_field + is_clean

#   # Cleanup:
#   migrator.reset()
