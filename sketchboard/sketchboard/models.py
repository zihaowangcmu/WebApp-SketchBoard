# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
	# Use OneToOne relationship here
	# profile_user = models.ForeignKey(User, default=None, related_name='profile_user')
	profile_user = models.OneToOneField(User, default=None, related_name='profile_user')
	bio = models.CharField(max_length=200)
	picture = models.FileField(upload_to="images", blank=True)
	content_type = models.CharField(max_length=50)

	def __unicode__(self):
		return 'id=' + str(self.id) + ', bio="' + self.bio + '", username='+str(self.profile_username)

class Canvases(models.Model):
    created_by = models.ManyToManyField(Profile, related_name="created_canvases")
    title  = models.CharField(max_length=200)
    pixels = models.TextField()
    created_time = models.DateTimeField()
    updated_time = models.DateTimeField()
    liked_by = models.ManyToManyField(Profile, related_name="likes")
    
class TextBox(models.Model):
    canvas = models.ForeignKey(Canvases)
    top = models.CharField(max_length=200, default = '50px')
    left = models.CharField(max_length=200, default = '50px')
    color = models.CharField(max_length=200, default='transparent')
    content_editable = models.BooleanField(default = True)
    aria_disabled = models.BooleanField(default = False)
    content = models.TextField(default='')


	#aria_disabled = 
# # This models can be used when we have many pages in one canvas maybe
# # For now, we only have one scribble on one canvas
# # So I just put the pixels filed in Canvases, which makes it easier.
# class Drawings(models.Model):
# 	pixels = models.TextField()
# 	belongs_to = models.ForeignKey(Canvases)

