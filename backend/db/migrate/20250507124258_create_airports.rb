class CreateAirports < ActiveRecord::Migration[8.0]
  def change
    create_table :airports do |t|
      t.string :name
      t.string :detailed_name
      t.string :iataCode
      t.float :latitude
      t.float :longitude
      t.string :cityName
      t.string :cityCode
      t.string :countryName
      t.string :countryCode

      t.timestamps
    end
  end
end
