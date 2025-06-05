class City < ApplicationRecord
  belongs_to :country
  
  has_many :points_of_interests
  has_many :accomodations
  validates :name, presence: true
end
