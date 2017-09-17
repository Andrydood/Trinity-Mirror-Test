# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-09-15 18:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Palindrome',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('text', models.TextField(blank=True)),
            ],
            options={
                'ordering': ('-created',),
            },
        ),
    ]
