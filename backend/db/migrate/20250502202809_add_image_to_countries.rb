class AddImageToCountries < ActiveRecord::Migration[8.0]
  def change
    add_column :countries, :image, :string
  end
end
