import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load your labeled dataset
df = pd.read_csv("collision_dataset.csv")

# Features and Labels
features = df[[
    "sat1_inclination", "sat1_eccentricity", "sat1_mean_motion",
    "sat2_inclination", "sat2_eccentricity", "sat2_mean_motion"
]]
labels = df["label"]

# Convert labels to numeric (collision=1, no_collision=0)
labels = labels.map({"collision": 1, "no_collision": 0})

# Train/Test split (optional but good practice)
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Test accuracy
y_pred = model.predict(X_test)
print(accuracy_score(y_test,y_pred)) #0.93333333 i.e 93% accuracy

# Save the model
joblib.dump(model, "rf_model.pkl")
print("Model trained and saved as rf_model.pkl")
