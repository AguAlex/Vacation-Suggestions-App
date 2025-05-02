# backend/lib/tasks/update_poi_ratings.rake

namespace :poi do
  desc "Update POIs with zero rating with a random rating between 1 and 5"
  task update_zero_ratings: :environment do
    puts "Updating POIs with zero rating..."

    # Găsește toate POIs cu rating 0
    PointsOfInterest.where(rating: 0).find_each do |poi|
      # Atribuie un rating random între 1 și 5
      new_rating = rand(1..5)
      poi.update(rating: new_rating)
      puts "Updated POI #{poi.name} with new rating: #{new_rating}"
    end

    puts "All POIs with rating 0 have been updated."
  end
end
