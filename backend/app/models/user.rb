class User < ApplicationRecord
    has_many :accomodations_users
    has_many :accomodations, through: :accomodations_users
end
