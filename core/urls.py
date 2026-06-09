from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('activities/', views.activities, name='activities'),
    path('tools/', views.tools, name='tools'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
]
