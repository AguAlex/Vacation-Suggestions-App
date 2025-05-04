class Like < ApplicationRecord
  belongs_to :user
  belongs_to :accomodation

  validates :user_id, uniqueness: { scope: :accomodation_id }
end
