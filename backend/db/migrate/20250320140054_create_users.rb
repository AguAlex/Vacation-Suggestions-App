class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :nume
      t.string :parola
      t.string :email

      t.timestamps
    end
  end
end
