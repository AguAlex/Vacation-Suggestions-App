# backend/lib/tasks/export_and_generate_som.rake
namespace :poi do
  desc "Export POIs to CSV and generate SOM"
  task generate_som: :environment do
    require 'csv'

    csv_path = Rails.root.join("public", "poi_data.csv")

    puts "[1/3] Exporting POIs to CSV..."
    CSV.open(csv_path, 'w') do |csv|
      csv << ["name", "latitude","longitude", "rating"]
      PointsOfInterest.find_each do |poi|
        # Verificăm dacă descrierea este NaN și o înlocuim cu un string valid
        # description = poi.description.nil? || poi.description == "NaN" ? "No description" : poi.description
        
        csv << [poi.name, poi.latitude,poi.longitude, poi.rating]
      end
    end

    puts "[2/3] Running Python SOM generator..."
    system("python lib/tasks/som.py")
    puts "[3/3] Done. SOM result saved in public/som_result.json"
  end
end

