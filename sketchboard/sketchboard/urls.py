from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from . import views
from sketchboard import views as my_views # Is this necessary?

urlpatterns = [
    url(r'^$',              views.home,             name='home'),
    url(r'^board$',         views.board,            name='board'),
    url(r'^my_profile$',    views.my_profile,       name='my_profile'),
    url(r'^register$',      views.register,         name='register'),
    url(r'^login$', auth_views.login, {'template_name':'sketchboard/login.html'}, name='login'),
    url(r'^logout$', auth_views.logout_then_login, name='logout'),
    url(r'^edit_bio$',   views.edit_bio,   name='edit_bio'),
    url(r'^add_photo$',   views.add_photo,   name='add_photo'),
    url(r'^get_photo/(?P<id>\d+)$', views.get_photo,    name='get_photo'),
    url(r'^error$',   views.error,   name='error'),
    url(r'^modalOpenRemove$',   views.modalOpenRemove,   name='modalOpenRemove'),

    #####################################################################################
    # Share the link
    url(r'^invite$',   views.invite,   name='invite'),
    url(r'^get_favorites_list$',  views.get_favorites_list,  name='get_favorites_list'),
    url(r'^favorite$',  views.favorite,  name='favorite'),
    url(r'^all_canvases$',  views.all_canvases,  name='all_canvases'),

    #####################################################################################
    # The followings are drawing functions
    url(r'^send_mouse_pusher$',   views.send_mouse_pusher,   name='send_mouse_pusher'),
    url(r'^send_clear_flag$',     views.send_clear_flag,     name='send_clear_flag'),
    url(r'^create_new_canvas$',   views.create_new_canvas,   name='create_new_canvas'),
    url(r'^get_canvas_list$',     views.get_canvas_list,     name='get_canvas_list'),
    url(r'^get_this_canvas_by_id$',  views.get_this_canvas_by_id,  name='get_this_canvas_by_id'),
    url(r'^get_coworkers_list$',  views.get_coworkers_list,  name='get_coworkers_list'),
    url(r'^like$',   views.like,   name='like'),
    url(r'^unlike$',   views.unlike,   name='unlike'),

    #####################################################################################
    ##################################Text Box###############################
    url(r'^send_disable$',  views.send_disable,  name='send_disable'),
    url(r'^send_content$',  views.send_content,  name='send_content'),
    url(r'^send_move_position$',  views.send_move_position,  name='send_move_position'),
    url(r'^add_box$',  views.add_box,  name='add_box'),
    url(r'^delete_box$',  views.delete_box,  name='delete_box'),
    url(r'^invite$',  views.invite,  name='invite'),
    url(r'^save_scribble$',  views.save_scribble,  name='save_scribble'),
    # url(r'^confirm-registration/(?P<userId>[0-9]+)/(?P<canvasId>[a-zA-Z0-9]+)/(?P<token>[a-z0-9\-]+)$',
    #     views.confirm_registration, name='confirm'),

        # url(r'^confirm-registration/(?P<userId>[a-zA-Z0-9\-\w]+)/(?P<canvasId>[a-zA-Z0-9]+)/(?P<token>[a-z0-9\-]+)$',
        # views.confirm_registration, name='confirm'),
    ]