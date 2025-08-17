import pandas as pd
from sgp4.api import Satrec, jday
from math import sqrt
import datetime
import random

# Load your TLE CSV file
df = pd.read_csv("tle_data.csv")  # Ensure this exists

def euclidean_distance(pos1, pos2):
    x1, y1, z1 = pos1
    x2, y2, z2 = pos2
    return sqrt((x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2)

# this function run a simulation of two satellites for 10 min and sees whether they collide or not
def simulate_distance(sat1, sat2, now, time_step_seconds=10, duration_minutes=10):
    min_distance = float("inf")
    for t in range(0, duration_minutes * 60, time_step_seconds):
        jd, fr = jday(now.year, now.month, now.day, now.hour, now.minute, now.second + t)
        e1, r1, _ = sat1.sgp4(jd, fr)
        e2, r2, _ = sat2.sgp4(jd, fr)
        if e1 == 0 and e2 == 0:
            dist = euclidean_distance(r1, r2)
            if dist < min_distance:
                min_distance = dist
    return min_distance

def generate_dataset(tle_df, no_collision_limit=900, collision_limit=300, threshold_km=0.001):
    dataset = []
    num_rows = len(tle_df)
    now = datetime.datetime.utcnow()

    # Generate no-collision data
    for i in range(min(no_collision_limit, num_rows)):
        for j in range(i + 1, i + 2):  # 1 pair per satellite
            sat1 = Satrec.twoline2rv(tle_df.iloc[i]["line1"], tle_df.iloc[i]["line2"])
            sat2 = Satrec.twoline2rv(tle_df.iloc[j]["line1"], tle_df.iloc[j]["line2"])
            dist = simulate_distance(sat1, sat2, now)
            dataset.append({
                "sat1_inclination": sat1.inclo,
                "sat1_eccentricity": sat1.ecco,
                "sat1_mean_motion": sat1.no_kozai,
                "sat2_inclination": sat2.inclo,
                "sat2_eccentricity": sat2.ecco,
                "sat2_mean_motion": sat2.no_kozai,
                "min_distance_km": dist,
                "label": "no_collision"
            })

    # Generate synthetic collision data
    for _ in range(collision_limit):
        i = random.randint(0, num_rows - 1)
        j = random.randint(0, num_rows - 1)
        sat1 = Satrec.twoline2rv(tle_df.iloc[i]["line1"], tle_df.iloc[i]["line2"])
        sat2 = Satrec.twoline2rv(tle_df.iloc[j]["line1"], tle_df.iloc[j]["line2"])

        # simulate close distance
        r1 = [random.uniform(1000, 2000) for _ in range(3)]
        r2 = [r1[0] + random.uniform(-0.0001, 0.0001),
              r1[1] + random.uniform(-0.0001, 0.0001),
              r1[2] + random.uniform(-0.0001, 0.0001)]

        dist = euclidean_distance(r1, r2)

        dataset.append({
            "sat1_inclination": sat1.inclo,
            "sat1_eccentricity": sat1.ecco,
            "sat1_mean_motion": sat1.no_kozai,
            "sat2_inclination": sat2.inclo,
            "sat2_eccentricity": sat2.ecco,
            "sat2_mean_motion": sat2.no_kozai,
            "min_distance_km": dist,
            "label": "collision"
        })

    return pd.DataFrame(dataset)

# Generate full dataset
df_final = generate_dataset(df, no_collision_limit=900, collision_limit=300)

# Save
df_final.to_csv("collision_dataset.csv", index=False)
print("collision_dataset.csv created with 900 no_collisions and 300 collisions.")
