from rest_framework import serializers

class TLERequestSerializer(serializers.Serializer):
    line1 = serializers.CharField()
    line2 = serializers.CharField()
    duration_seconds = serializers.IntegerField(default=30)

class CustomSatelliteSerializer(serializers.Serializer):
    tle = serializers.CharField(help_text="TLE data (2 lines)")
    satellite_name = serializers.CharField(help_text="Name of the satellite")

# JSON <-> py objects