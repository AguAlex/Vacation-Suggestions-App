class AddFieldsToPointsOfInterest < ActiveRecord::Migration[8.0]
  def change
    add_column :points_of_interests, :link, :string
    add_column :points_of_interests, :image, :string
    add_column :points_of_interests, :price, :float
    add_column :points_of_interests, :description, :string
  end
end
