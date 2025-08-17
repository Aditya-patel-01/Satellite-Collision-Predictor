
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from .serializers import TLERequestSerializer, CustomSatelliteSerializer
from sgp4.api import Satrec, jday # type: ignore
import datetime
import pandas as pd
import os
import joblib  # For loading your ML model
import json
from django.core.cache import cache

model_path = os.path.join(settings.BASE_DIR, "ml", "rf_model.pkl")
model = joblib.load(model_path)

# initialize simulated time
simulated_time = datetime.datetime.now(datetime.timezone.utc)

# Global storage for custom satellites (in production, use database)
CUSTOM_SATELLITES_KEY = "custom_satellites"

def get_custom_satellites():
    """Get custom satellites from cache"""
    satellites = cache.get(CUSTOM_SATELLITES_KEY)
    return satellites if satellites else {}

def save_custom_satellites(satellites):
    """Save custom satellites to cache"""
    cache.set(CUSTOM_SATELLITES_KEY, satellites, timeout=86400)  # 24 hours

def generate_orbital_positions(tle_line1, tle_line2, num_positions=1000):
    """
    Generate orbital positions for a satellite using TLE data
    Returns positions that can be looped infinitely
    """
    try:
        sat = Satrec.twoline2rv(tle_line1, tle_line2)
        positions = []
        
        # Generate positions for one complete orbit (approximately 90 minutes for LEO)
        # Using smaller time steps for smoother animation
        for step in range(num_positions):
            # Calculate time: 90 minutes = 5400 seconds, divided into num_positions steps
            time_seconds = (step * 5400) / num_positions
            
            # Use current date as base
            now = datetime.datetime.now(datetime.timezone.utc)
            jd, fr = jday(
                now.year, now.month, now.day,
                now.hour, now.minute, now.second + time_seconds
            )
            
            error, pos, vel = sat.sgp4(jd, fr)
            
            if error == 0:  # Success
                positions.append(pos)
            else:
                # If error, use previous position or default
                if positions:
                    positions.append(positions[-1])
                else:
                    positions.append([0, 0, 0])
        
        return positions
    except Exception as e:
        print(f"Error generating positions: {e}")
        return []

class CustomSatelliteView(APIView):
    """Handle adding, removing, and managing custom satellites"""
    
    def post(self, request):
        """Add a new custom satellite"""
        try:
            tle_data = request.data.get('tle', '').strip()
            satellite_name = request.data.get('satellite_name', '').strip()
            
            if not tle_data or not satellite_name:
                return Response({
                    "error": "Both TLE data and satellite name are required"
                }, status=400)
            
            # Parse TLE data (expecting 2 lines)
            tle_lines = tle_data.strip().split('\n')
            if len(tle_lines) < 2:
                return Response({
                    "error": "TLE data must contain exactly 2 lines"
                }, status=400)
            
            line1 = tle_lines[0].strip()
            line2 = tle_lines[1].strip()
            
            # Validate TLE format
            if not line1.startswith('1 ') or not line2.startswith('2 '):
                return Response({
                    "error": "Invalid TLE format. Line 1 must start with '1 ' and Line 2 must start with '2 '"
                }, status=400)
            
            # Generate orbital positions
            positions = generate_orbital_positions(line1, line2)
            
            if not positions:
                return Response({
                    "error": "Failed to generate orbital positions from TLE data"
                }, status=400)
            
            # Get existing satellites
            custom_satellites = get_custom_satellites()
            
            # Check if satellite name already exists
            if satellite_name in custom_satellites:
                return Response({
                    "error": f"Satellite '{satellite_name}' already exists"
                }, status=400)
            
            # Add new satellite
            custom_satellites[satellite_name] = {
                'name': satellite_name,
                'tle_line1': line1,
                'tle_line2': line2,
                'positions': positions,
                'created_at': datetime.datetime.now().isoformat()
            }
            
            # Save to cache
            save_custom_satellites(custom_satellites)
            
            return Response({
                "message": f"Satellite '{satellite_name}' added successfully",
                "satellite": {
                    "name": satellite_name,
                    "positions_count": len(positions)
                }
            })
            
        except Exception as e:
            return Response({
                "error": f"Failed to add satellite: {str(e)}"
            }, status=500)
    
    def delete(self, request):
        """Remove a custom satellite"""
        try:
            satellite_name = request.data.get('satellite_name', '').strip()
            
            if not satellite_name:
                return Response({
                    "error": "Satellite name is required"
                }, status=400)
            
            custom_satellites = get_custom_satellites()
            
            if satellite_name not in custom_satellites:
                return Response({
                    "error": f"Satellite '{satellite_name}' not found"
                }, status=404)
            
            # Remove satellite
            del custom_satellites[satellite_name]
            save_custom_satellites(custom_satellites)
            
            return Response({
                "message": f"Satellite '{satellite_name}' removed successfully"
            })
            
        except Exception as e:
            return Response({
                "error": f"Failed to remove satellite: {str(e)}"
            }, status=500)
    
    def get(self, request):
        """Get all custom satellites"""
        try:
            custom_satellites = get_custom_satellites()
            
            satellites_list = []
            for name, data in custom_satellites.items():
                satellites_list.append({
                    "name": data['name'],
                    "positions_count": len(data['positions']),
                    "created_at": data['created_at']
                })
            
            return Response({
                "satellites": satellites_list,
                "total_count": len(satellites_list)
            })
            
        except Exception as e:
            return Response({
                "error": f"Failed to get satellites: {str(e)}"
            }, status=500)

class SatellitePositionView(APIView):
    def post(self, request):
        serializer = TLERequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        line1 = serializer.validated_data['line1']
        line2 = serializer.validated_data['line2']
        duration_seconds = serializer.validated_data['duration_seconds']
        
        sat = Satrec.twoline2rv(line1, line2)
        
        positions = []
        for step in range(0, duration_seconds * 10):
            second = step * 0.1
            jd, fr = jday(2024, 6, 26, 0, 0, second)
            error, pos, vel = sat.sgp4(jd, fr)
            positions.append({
                "time": second,
                "position": pos,
                "velocity": vel
            })
        
        return Response({"positions": positions})

    def get(self, request):
        """Get positions for all satellites (custom + default)"""
        global simulated_time
        # advance simulated time by 10 seconds for every poll
        simulated_time += datetime.timedelta(seconds=10)
        now = simulated_time

        # Get custom satellites
        custom_satellites = get_custom_satellites()
        
        results = []
        
        # Add custom satellites
        for name, sat_data in custom_satellites.items():
            positions = sat_data['positions']
            if positions:
                # Calculate current position index based on time
                # This creates infinite loop through positions
                current_index = int((now.timestamp() * 10) % len(positions))
                current_position = positions[current_index]
                
                results.append({
                    "name": name,
                    "position": current_position,
                    "type": "custom"
                })

        # If no custom satellites, return empty list
        # (removed default satellites as requested)
        
        return Response({"satellites": results})

class CollisionPredictionView(APIView):
    def post(self, request):
        tle1 = request.data.get("tle1")
        tle2 = request.data.get("tle2")

        if not tle1 or not tle2:
            return Response({"error": "Both TLEs are required"}, status=400)

        try:
            line1a, line1b = tle1.strip().split("\n")
            line2a, line2b = tle2.strip().split("\n")

            sat1 = Satrec.twoline2rv(line1a, line1b)
            sat2 = Satrec.twoline2rv(line2a, line2b)

            features = [
                sat1.inclo, sat1.ecco, sat1.no_kozai,
                sat2.inclo, sat2.ecco, sat2.no_kozai,
            ]

            feature_names = [
                "sat1_inclination", "sat1_eccentricity", "sat1_mean_motion",
                "sat2_inclination", "sat2_eccentricity", "sat2_mean_motion"
            ]
            features_df = pd.DataFrame([features], columns=feature_names)

            prediction = model.predict(features_df)[0]
            result = "collision" if prediction == 1 else "no_collision"
            return Response({"prediction": result})

        except Exception as e:
            return Response({"error": str(e)}, status=500)