class AddLinkAndImagineToAccomodations < ActiveRecord::Migration[8.0]
  def change
    add_column :accomodations, :link, :string
    add_column :accomodations, :imagine, :string
  end
end
