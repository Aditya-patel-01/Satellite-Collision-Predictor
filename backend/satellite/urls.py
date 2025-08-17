from django.urls import path
from .views import hello
from .views import *

urlpatterns = [
    path('hello/', hello, name="hello"),
    path("visualize/", TLEVisualizationView.as_view(), name="tle-visualize"),
]

 