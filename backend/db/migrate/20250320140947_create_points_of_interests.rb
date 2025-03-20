class CreatePointsOfInterests < ActiveRecord::Migration[8.0]
  def change
    create_table :points_of_interests do |t|
      t.string :name
      t.float :rating
      t.string :category
      t.references :city, null: false, foreign_key: true

      t.timestamps
    end
  end
end
