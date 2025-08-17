import requests
import pandas as pd

# download the TLE data
url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle"
response = requests.get(url)
tle_text = response.text

lines = tle_text.strip().splitlines()

# collect into a list of dicts
data = []
for i in range(0, len(lines), 3):
    name = lines[i].strip()
    line1 = lines[i+1].strip()
    line2 = lines[i+2].strip()
    data.append({
        "name": name,
        "line1": line1,
        "line2": line2
    })

# convert to DataFrame
df = pd.DataFrame(data)

# save to CSV
df.to_csv("tle_data.csv", index=False)

print(f"Saved {len(df)} satellites to tle_data.csv")
