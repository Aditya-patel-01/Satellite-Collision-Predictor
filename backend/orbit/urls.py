from django.urls import path
from .views import *

urlpatterns = [
    path('positions/', SatellitePositionView.as_view()),
    path('predict/', CollisionPredictionView.as_view()),
    path('satellites/', CustomSatelliteView.as_view()),
]
  