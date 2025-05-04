class User < ApplicationRecord
    has_many :accomodations_users
    has_many :accomodations, through: :accomodations_users

    has_many :likes
    has_many :liked_accomodations, through: :likes, source: :accomodation

    has_secure_password

    validates :email, presence: true, uniqueness: true
    validates :nume, presence: true
    validates :password, presence: true  
end
