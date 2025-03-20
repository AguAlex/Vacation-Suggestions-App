class CreateAccomodationsUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :accomodations_users do |t|
      t.references :user, null: false, foreign_key: true
      t.references :accomodation, null: false, foreign_key: true
      t.date :check_in_date
      t.date :check_out_date

      t.timestamps
    end
  end
end
