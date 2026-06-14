import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

data = {
    'spot_id': ['mall_road']*100 + ['jakhu_temple']*100 + ['ridge']*100,
    'month': np.tile(range(1, 13), 25)[:300],
    'crowd_level': np.random.choice([0, 1, 2], 300, p=[0.3, 0.4, 0.3])
}

df = pd.DataFrame(data)
X = df[['month']].values
y = df['crowd_level'].values

model = RandomForestClassifier(n_estimators=10, random_state=42)
model.fit(X, y)

os.makedirs('.', exist_ok=True)
with open('crowd_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✓ Model saved")
