# Generated by Django 3.2.6 on 2022-03-29 13:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Movie',
            new_name='MovieModel',
        ),
        migrations.RenameModel(
            old_name='User',
            new_name='UserModel',
        ),
        migrations.RenameModel(
            old_name='Word',
            new_name='WordModel',
        ),
    ]