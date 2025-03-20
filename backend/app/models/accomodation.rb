class Accomodation < ApplicationRecord
  belongs_to :city
  has_many :accomodations_users
  has_many :users, through: :accomodations_users
end
