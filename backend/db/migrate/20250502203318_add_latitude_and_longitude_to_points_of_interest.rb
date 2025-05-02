class AddLatitudeAndLongitudeToPointsOfInterest < ActiveRecord::Migration[8.0]
  def change
    add_column :points_of_interests, :latitude, :float
    add_column :points_of_interests, :longitude, :float
  end
end
