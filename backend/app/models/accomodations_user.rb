class AccomodationsUser < ApplicationRecord
  belongs_to :user
  belongs_to :accomodation

  validates :user_id, uniqueness: { scope: :accommodation_id } # un favorit per user/accommodation
end
