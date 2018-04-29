# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.utils import timezone,encoding

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers

# Imports the Item class
from sketchboard.models import *
from sketchboard.forms  import *
from operator import attrgetter
from django.views.decorators.csrf import ensure_csrf_cookie
import json
import pusher
from django.db import transaction

# Used to generate a one-time-use token to verify a user's email address
from django.contrib.auth.tokens import default_token_generator
# Used to send mail from within Django
from django.core.mail import send_mail
from sketchboard.forms import RegistrationForm

pusher_client = pusher.Pusher(
  app_id='508516',
  key='620c2d185b04ef2c539f',
  secret='3c5744ed86db81df0303',
  cluster='us2',
  ssl=True
)

############################################################
###################Email invitation#########################
@transaction.atomic
@login_required
def invite(request):
    if request.method != 'POST':
      raise Http404

    context = {}

    canvasId = request.POST['id']
    userEmail = request.POST['email']
    currUser = get_object_or_404(User, email=userEmail)
    canvas = get_object_or_404(Canvases, id = canvasId)
    userId = currUser.id;

    profile = get_object_or_404(Profile, id=currUser.id)
    canvas.created_by.add(profile)
    canvas.save()
    token = default_token_generator.make_token(currUser)
    email_body = """
                Hi! A new canvas "{canvasName}" is shared with you on SketchBoard from {sender}.
                Login to SketchBoard and check!
                """.format(canvasName=canvas.title,
                          sender=request.user.username,)
                # path=reverse('confirm', args=(userId,canvasId, token )))

    send_mail(subject="A new canvas is shared with you on SketchBoard!",
                message= email_body,
                from_email="zwang2@andrew.cmu.edu",
                recipient_list=[userEmail])
    return HttpResponse(json.dumps({'message':'sent'}), content_type='application/json')

# @transaction.atomic
# def confirm_registration(request, userId,canvasId, token):
#     # Send 404 error if token is invalid
#     currUser = get_object_or_404(User, id=userId)
#     print(currUser.username)
#     if not default_token_generator.check_token(currUser, token):
#         raise Http404

#     # Otherwise token was valid, activate the user.
#     profile = get_object_or_404(Profile, id=currUser.id)
#     canvas = get_object_or_404(Canvases, id=canvasId)
#     canvas.created_by.add(profile)
#     canvas.save()

#     return redirect(reverse('home'))


############################################################
#######################Social network#######################
@ensure_csrf_cookie
@login_required
def home(request):
    context = {}
    context['items'] = Profile.objects.filter(profile_user=request.user)
    return render(request, 'sketchboard/home.html', context)

@login_required
def favorite(request):
    context = {}
    return render(request, 'sketchboard/favorite.html', context)

@login_required
def all_canvases(request):
    context = {}
    return render(request, 'sketchboard/all_canvases.html', context)

@login_required
def board(request):
    context = {}
    context['items'] = Profile.objects.filter(profile_user=request.user)
    if 'id' not in request.GET:
        message = "Sorry, this canvas doesn't exist."
        context['message'] = message
        return render(request, 'sketchboard/error.html', context)

    this_id = request.GET['id']
    this_user = Profile.objects.get(profile_user__username=request.user.username)
    this_canvas = this_user.created_canvases.filter(id=this_id)
    if not this_canvas:
        message = "Sorry, this canvas doesn't exist or you do not have access to it."
        context['message'] = message
        return render(request, 'sketchboard/error.html', context)

    context = {'id' : request.GET['id']}

    return render(request, 'sketchboard/board.html', context)


@transaction.atomic
def register(request):
    context = {}

    # Just display the registration form if this is a GET request.
    if request.method == 'GET':
        context['form'] = RegistrationForm()
        return render(request, 'sketchboard/register.html', context)

    # Creates a bound form from the request POST parameters and makes the 
    # form available in the request context dictionary.
    form = RegistrationForm(request.POST)
    context['form'] = form

    # Validates the form.
    if not form.is_valid():
        return render(request, 'sketchboard/register.html', context)

    # At this point, the form data is valid.  Register and login the user.
    new_user = User.objects.create_user(username=form.cleaned_data['username'], 
                                        password=form.cleaned_data['password1'],
                                        email=form.cleaned_data['email'],
                                        first_name=form.cleaned_data['first_name'],
                                        last_name=form.cleaned_data['last_name'])
    new_user.save()

    # Initialize user profile
    new_profile = Profile(content_type="",
            picture="",
            bio="Welcome To SketchBoard :)",
            id=new_user.id,
            profile_user=new_user,
            )
    new_profile.save()

    # Logs in the new user and redirects to his/her home
    new_user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password1'])
    login(request, new_user)
    # I make it reverse to home
    # So that it make sure the user will click on "create" to create a canvas
    # Or the database will bug since reverse to board didn't make a new canvas model obj
    return redirect(reverse('home'))
    
############# update and get profile ##############
@login_required
def my_profile(request):
    context = {}
    context['form'] = ProfileForm()
    context['items'] = Profile.objects.filter(profile_user=request.user)
    return render(request, 'sketchboard/my_profile.html', context)

@login_required
def edit_bio(request):
    context = {}
    current_username = request.user.username
    user_list = []
    for user in Profile.objects.all():
        user_list.append(user.profile_user.username)

    if current_username not in user_list:
        message = "Sorry, this user doesn't exist."
        context['message'] = message
        return render(request, 'sketchboard/error.html', context)

    current_user = request.user.profile_user
    if 'bio' not in request.POST or not request.POST['bio']:
        message = 'The Bio information is illegal.'
        context['message'] = message
        return render(request, 'sketchboard/error.html', context)

    current_user.bio = request.POST['bio']
    current_user.save()
    context['form'] = ProfileForm()
    context['items'] = Profile.objects.filter(profile_user=request.user)
    return render(request, 'sketchboard/my_profile.html', context)

@login_required
def add_photo(request):
    context = {}
    form = ProfileForm(request.POST, request.FILES, instance=request.user.profile_user)
    if not form.is_valid():
        context['form'] = form
    else:
        if hasattr(form.cleaned_data['picture'],'content_type'):
            request.user.profile_user.content_type = form.cleaned_data['picture'].content_type
        form.save()
        context['message'] = 'Item #{0} saved.'.format(request.user.id)
        context['form'] = ProfileForm()

    context['items'] = Profile.objects.filter(profile_user=request.user)
    return render(request, 'sketchboard/my_profile.html', context)

@login_required
def get_photo(request, id):
    context = {}
    item = get_object_or_404(Profile, id=id)
    context['test'] = "test:get_photo"
    # Probably don't need this check as form validation requires a picture be uploaded.
    if not item.picture:
        message = "Sorry, there is not the photo."
        context['message'] = message
        return render(request, 'sketchboard/error.html', context)

    return HttpResponse(item.picture, content_type=item.content_type)

def error(request):
    context = {}
    context['message'] = 'Sorry, some error occurs.'
    return render(request, 'sketchboard/error.html', context)
    
@login_required
def modalOpenRemove(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    this_canvas = Canvases.objects.get(id=request.POST['id'])
    this_canvas.delete()
    data = {'id' : request.POST['id']}

    return HttpResponse(json.dumps(data), content_type='application/json')

# @login_required
# def my_profile(request):
#     context = {}
#     if request.method == 'GET':
#         my_profile = Profile.objects.filter(profile_user__exact=request.user).latest('id')
#         context['form'] = ProfileForm()
#         context['profile'] = my_profile
#         return render(request, 'sketchboard/my_profile.html', context)

#############################################################################
############################# Drawing functions #############################
@login_required
def send_mouse_pusher(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    mouse_data = {'id' : request.POST['id'],
                  'x'  : request.POST.getlist('x'),
                  'y'  : request.POST.getlist('y'),
                  'r'  : request.POST['r'],
                  'g'  : request.POST['g'],
                  'b'  : request.POST['b'],
                  'd'  : request.POST['d'],
                  }

    pusher_client.trigger('drawing-channel', 'drawing-event', mouse_data)
    return render(request, 'sketchboard/board.html', mouse_data)

@login_required
def send_clear_flag(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    clear_data = {'clear' : True,
                   'id'    : request.POST['id']}

    QuerySet_pixels = Canvases.objects.filter(id=request.POST['id'])
    obj_pixels = list(QuerySet_pixels)[0]
    # Just make obj_pixels.pixels 
    obj_pixels.pixels = '255'
    obj_pixels.updated_time = timezone.now()
    obj_pixels.save()

    pusher_client.trigger('drawing-channel', 'clear-event', clear_data)
    return render(request, 'sketchboard/board.html', clear_data)

@login_required
def save_scribble(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    QuerySet_pixels = Canvases.objects.filter(id=request.POST['id'])
    obj_pixels = list(QuerySet_pixels)[0]
    obj_pixels.pixels = request.POST['ps']
    obj_pixels.updated_time = timezone.now()
    obj_pixels.save()
    return HttpResponse({}, content_type='application/json')

@login_required
def get_this_canvas_by_id(request):
    context = {}
    context['items'] = Profile.objects.filter(profile_user=request.user)
    if request.method != 'POST':
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    # Data type changes as follows:
    # QuerySet -> object -> list of strings

    # Pixels info
    QuerySet_pixels = Canvases.objects.filter(id=request.POST['id'])
    obj_pixels = list(QuerySet_pixels)[0]
    str_pixels = obj_pixels.pixels
    response_pixels = str_pixels.split(',')

    # Text boxes info
    boxes = TextBox.objects.all().filter(canvas = obj_pixels)
    response_text = serializers.serialize('json', boxes)

    response = {
              'pixels' : response_pixels,
              'boxes'  : response_text,
              }

    return HttpResponse(json.dumps(response), content_type='application/json')

@login_required
def create_new_canvas(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    # Save the list not the dict!
    # And set '255' to represent a blank canvas. Really fast!
    new_canvas = Canvases(created_time=timezone.now(),
                        updated_time=timezone.now(),
                        title=request.POST['title'],
                        pixels='255',)
    new_canvas.save()
    new_canvas.created_by.add(request.user.profile_user)
    # pixels field is like: '255,255,.....' and is a str
    new_canvas.save()

    pixels = {
                'id' : new_canvas.id,
                }

    return HttpResponse(json.dumps(pixels), content_type='application/json')

@login_required
def get_canvas_list(request):
    # Get all the canvases that belong to this user 
    current_user = request.user.profile_user
    all_canvases = current_user.created_canvases.all()
    ids    = []
    titles = []

    for canvas in all_canvases:
        ids.append(canvas.id)
        titles.append(canvas.title)

    all_favourites = current_user.likes.all()
    all_favourites_list = []
    for canvas in all_favourites:
      all_favourites_list.append(canvas.id)
    
    # VERY IMPORTANT
    # Here, instead of parsing the object, we only parse the info
    # that we need. So it saves time and space. Only thing is to 
    # keep the order correct.

    data = {
            'ids'    : ids,
            'titles' : titles,
            # 'times'  : times,
            'likes'  : all_favourites_list,
            }

    return HttpResponse(json.dumps(data), content_type='application/json')

@login_required
def get_favorites_list(request):
    # Get favorite canvases that belong to this user 
    current_user = request.user.profile_user
    all_favorites = current_user.likes.all()
    ids    = []
    titles = []
    
    for canvas in all_favorites:
        ids.append(canvas.id)
        titles.append(canvas.title)

    data = {'ids'    : ids,
            'titles' : titles,
            }

    return HttpResponse(json.dumps(data), content_type='application/json')

@login_required
def get_coworkers_list(request):
    # Get all the co-workers of the canvas
    canvas_id = request.POST['id']
    current_canvas = Canvases.objects.get(id=canvas_id)

    all_workers = current_canvas.created_by.all()
    workers_emails_list = []
    workers_names_list  = []
    for worker in all_workers:
      workers_emails_list.append(worker.profile_user.email)
      workers_names_list.append(worker.profile_user.username)

    data = {'coworkers_emails' : workers_emails_list,
          'coworkers_names'  : workers_names_list}
    return HttpResponse(json.dumps(data), content_type='application/json')

@login_required
def like(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    canvasId = request.POST['id']
    this_user = request.user.profile_user
    this_canvas = Canvases.objects.get(id = canvasId)
    this_canvas.liked_by.add(this_user)
    data = {}

    return HttpResponse(json.dumps(data), content_type='application/json')

@login_required
def unlike(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    canvasId = request.POST['id']
    this_user = request.user.profile_user
    this_canvas = Canvases.objects.get(id = canvasId)
    this_canvas.liked_by.remove(this_user)
    data = {}
    
    return HttpResponse(json.dumps(data), content_type='application/json')

#################################### FIN ####################################
#############################################################################

#########################################################################
##################################Text Box###############################
##################################Text Box###############################
#########################################################################
#########################################################################
#########################################################################
def add_box(request) :
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    canvasId = request.POST['canvasId']
    curr_canvas = Canvases.objects.get(id = canvasId)
    if request.POST['type']=="box":
        new_box = TextBox(
                  canvas= curr_canvas
                          )
    elif request.POST['type']=="note":
        new_box = TextBox(
                  canvas= curr_canvas,
                  color = request.POST['color'],
                          )
    new_box.save()
    data = {
              'canvasId':canvasId,
              'id':new_box.pk,
              'color': new_box.color,
            }

    pusher_client.trigger('drawing-channel', 'add_box', data)
    return render(request, 'sketchboard/board.html', data)


def delete_box(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)

    canvasId = request.POST['canvasId']
    boxId = request.POST['boxId']
    curr_canvas = Canvases.objects.get(id = canvasId)
    curr_box  = get_object_or_404(TextBox,pk=boxId)
    curr_box.delete()
    data = {
              'canvasId':canvasId,
              'id':request.POST['boxId'],
      }
    pusher_client.trigger('drawing-channel', 'delete_box', data)
    return render(request, 'sketchboard/board.html', data)

###########################
def send_disable(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)
    ####### Need to change content edit able and aria disable ######

    currId = request.POST['id']
    related_box = get_object_or_404(TextBox,pk=currId)
    related_box.content_editable = False
    related_box.aria_disabled = True
    related_box.save()
    ########## real-time stuff
    data = {
              'id':request.POST['id'],
            }
    pusher_client.trigger('drawing-channel', 'disable', data,request.POST['socket_id'])
    return render(request, 'sketchboard/board.html', data)

def send_content(request):
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)
    ####### Need to change html content ######
    currId = request.POST['id']
    related_box = get_object_or_404(TextBox,pk=currId)
    # Found, update 
    related_box.content = request.POST['content']
    related_box.save()
    ########## real-time stuff  
    data = {
              'id':request.POST['id'],
              'content':request.POST['content']
    }
    pusher_client.trigger('drawing-channel', 'contentUpdate', data,request.POST['socket_id'])
    return render(request, 'sketchboard/board.html', data)

def send_move_position(request):
    ####### Need to change top and left ######
    if request.method != 'POST':
        context = {}
        context['message'] = 'Oops! Errors occured. Please try again!'
        return render(request, 'sketchboard/error.html', context)
    currId = request.POST['id']
    related_box = get_object_or_404(TextBox,pk=currId)
    # Found, update 
    related_box.top = request.POST['top']
    related_box.left = request.POST['left']
    related_box.save()
    ########## real-time stuff
    data = {
              'id':request.POST['id'],
              'top':request.POST['top'],
              'left':request.POST['left']
            }
    pusher_client.trigger('drawing-channel', 'moveUpdate', data,request.POST['socket_id'])
    return render(request, 'sketchboard/board.html', data)
