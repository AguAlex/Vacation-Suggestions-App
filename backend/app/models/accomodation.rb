class Accomodation < ApplicationRecord
  belongs_to :city
  has_many :accomodations_users
  has_many :users, through: :accomodations_users

  has_many :likes
  has_many :liked_by_users, through: :likes, source: :user


  def likes_count
    likes.size
  end
end
