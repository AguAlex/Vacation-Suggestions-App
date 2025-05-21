require 'rails_helper'

RSpec.describe Like, type: :model do
  let(:user) do
    User.create!(
      email: "user#{rand(1000)}@example.com", # email unic random
      nume: 'Ion',
      password: 'password'
    )
  end

  let(:city) do
    City.create!(name: "Test City", country: Country.create!(name: "Test Country"))
  end

  let(:accomodation1) do
    Accomodation.create!(
      category: 'Hotel',
      name: 'Hotel Test 1',
      distance_to_city: 5,
      price: 100,
      rating: 4,
      city: city,
      link: 'http://testhotel1.com'
    )
  end

  let(:accomodation2) do
    Accomodation.create!(
      category: 'Hotel',
      name: 'Hotel Test 2',
      distance_to_city: 10,
      price: 150,
      rating: 5,
      city: city,
      link: 'http://testhotel2.com'
    )
  end

  describe 'validations' do
    it 'permite un singur like per user per accomodation' do
      Like.create!(user: user, accomodation: accomodation1)
      duplicate_like = Like.new(user: user, accomodation: accomodation1)

      expect(duplicate_like).to_not be_valid
      expect(duplicate_like.errors[:user_id]).to include('has already been taken')
    end

    it 'permite like-uri diferite pentru user si cazari diferite' do
      Like.create!(user: user, accomodation: accomodation1)
      like2 = Like.new(user: user, accomodation: accomodation2)

      expect(like2).to be_valid
    end
  end
end
