import pandas as pd
import numpy as np
from minisom import MiniSom
import json

# Citește fișierul CSV
csv_path = 'public/poi_data.csv'
poi_data = pd.read_csv(csv_path)

# Extrage latitudinea și longitudinea
coordinates = poi_data[['latitude', 'longitude']].values

# Normalizăm datele pentru o mai bună performanță a SOM
coordinates = (coordinates - coordinates.min(axis=0)) / (coordinates.max(axis=0) - coordinates.min(axis=0))

# Setăm dimensiunile hărții SOM
som_dim = 4  # Dimensiune 10x10 pentru harta SOM
som = MiniSom(som_dim, som_dim, 2, sigma=1.6, learning_rate=0.5)  # 2 dimensiuni (latitudine și longitudine)
som.train(coordinates, 1000, verbose=True)  # Antrenăm SOM-ul cu 1000 de iterații

# Obținem rezultatele SOM
win_map = som.win_map(coordinates)

# Salvăm rezultatele într-un fișier JSON
som_result = {}
for position, points in win_map.items():
    som_result[str(position)] = [poi_data.iloc[i].to_dict() for i in range(len(poi_data)) if np.array_equal(coordinates[i], points[0])]

# Scriem rezultatele într-un fișier JSON
result_path = 'public/som_result.json'
with open(result_path, 'w') as f:
    json.dump(som_result, f, indent=2)

print("SOM generated and saved to 'public/som_result.json'")
