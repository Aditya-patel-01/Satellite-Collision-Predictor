from django.conf import settings
from sgp4.api import Satrec, jday  # type: ignore # For satellite propagation
from rest_framework.views import APIView  # type: ignore # DRF class-based views
from rest_framework.decorators import api_view  # type: ignore # For function-based views like hello
from rest_framework.response import Response  # type: ignore # For sending responses
import pandas as pd  # For handling feature DataFrame
from datetime import datetime, timedelta  # For time calculations
import numpy as np  # Optional but often used with satellite data
import joblib  # For loading your ML model
import os

model_path = os.path.join(settings.BASE_DIR, "ml", "rf_model.pkl")
model = joblib.load(model_path)


@api_view(['GET'])
def hello(request):
    return Response({"message": "Hello from Django backend!"})



class TLEVisualizationView(APIView):

    def post(self, request):
        tle1 = request.data.get("tle1")
        tle2 = request.data.get("tle2")

        if not tle1 or not tle2:
            return Response({"error": "Both TLEs are required"}, status=400)

        try:
            # Parse TLEs
            line1a, line1b = tle1.strip().split("\n")
            line2a, line2b = tle2.strip().split("\n")

            sat1 = Satrec.twoline2rv(line1a, line1b)
            sat2 = Satrec.twoline2rv(line2a, line2b)

            # Extract features for ML model
            features = [
                sat1.inclo, sat1.ecco, sat1.no_kozai,
                sat2.inclo, sat2.ecco, sat2.no_kozai
            ]
            features_df = pd.DataFrame([features], columns=[
                "sat1_inclination", "sat1_eccentricity", "sat1_mean_motion",
                "sat2_inclination", "sat2_eccentricity", "sat2_mean_motion"
            ])

            # Predict collision using ML model only
            prediction = model.predict(features_df)[0]
            result = "collision" if prediction == 1 else "no_collision"

            # Generate trails for visualization (no collision detection)
            def generate_trail(sat, minutes=1440, step_sec=60):
                now = datetime.utcnow()
                trail = []
                for t in range(0, minutes * 60, step_sec):
                    current_time = now + timedelta(seconds=t)
                    jd, fr = jday(current_time.year, current_time.month, current_time.day,
                                  current_time.hour, current_time.minute,
                                  current_time.second + current_time.microsecond / 1e6)
                    e, r, _ = sat.sgp4(jd, fr)
                    if e != 0:  # Error in propagation
                        break
                    trail.append({
                        "timestamp": current_time.isoformat(),
                        "position": r  # in kilometers
                    }) 
                return trail

            trail1 = generate_trail(sat1)
            trail2 = generate_trail(sat2)

            return Response({
                "prediction": result,
                "trails": [
                    {"name": "Satellite 1", "positions": trail1},
                    {"name": "Satellite 2", "positions": trail2}
                ]
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

