class CreateAccomodations < ActiveRecord::Migration[8.0]
  def change
    create_table :accomodations do |t|
      t.string :category
      t.string :name
      t.float :distance_to_city
      t.float :price
      t.float :rating
      t.references :city, null: false, foreign_key: true

      t.timestamps
    end
  end
end
