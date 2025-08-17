# test_sgp4.py
# from sgp4.api import Satrec, jday

# sample ISS TLE
line1 = "1 25544U 98067A   24176.43130787  .00015944  00000+0  28697-3 0  9997"
line2 = "2 25544  51.6405  97.6018 0005068 185.9944 276.2257 15.50387286453432"

# # create a satellite record
# satellite = Satrec.twoline2rv(line1, line2)

# # get current Julian date
# jd, fr = jday(2024, 6, 26, 12, 0, 0)   # example date+time

# # propagate (compute position and velocity)
# error_code, position, velocity = satellite.sgp4(jd, fr)

# print("Position (km):", position)
# print("Velocity (km/s):", velocity)

from sgp4.api import Satrec, jday # type: ignore

# sample ISS TLE
line1 = "1 25544U 98067A   24176.43130787  .00015944  00000+0  28697-3 0  9997"
line2 = "2 25544  51.6405  97.6018 0005068 185.9944 276.2257 15.50387286453432"

satellite = Satrec.twoline2rv(line1, line2)

# simulate positions every second for 30 seconds
for second in range(0, 30):
    jd, fr = jday(2024, 6, 26, 0, 0, second)
    error, pos, vel = satellite.sgp4(jd, fr)
    print(f"Time +{second}s → Pos(km): {pos}  Vel(km/s): {vel}")

