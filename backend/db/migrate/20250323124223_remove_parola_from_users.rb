class RemoveParolaFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :parola, :string
  end
end
