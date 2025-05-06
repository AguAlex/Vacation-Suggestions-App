class AddIataCodeToCities < ActiveRecord::Migration[8.0]
  def change
    add_column :cities, :iata_code, :string
  end
end
