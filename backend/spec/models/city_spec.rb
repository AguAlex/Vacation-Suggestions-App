require 'rails_helper'

RSpec.describe City, type: :model do
  describe 'validari' do
    let(:country) { Country.create!(name: 'România') }

    it 'este valid cu un nume si o tara asociata' do
      city = City.new(name: 'Cluj-Napoca', country: country)
      expect(city).to be_valid
    end

    it 'nu este valid fara nume' do
      city = City.new(name: nil, country: country)
      expect(city).to_not be_valid
    end

    it 'nu este valid fara tara asociata' do
      city = City.new(name: 'Iași', country: nil)
      expect(city).to_not be_valid
    end
  end

  describe 'asocieri' do
    it { should belong_to(:country) }
    it { should have_many(:points_of_interests) }
    it { should have_many(:accomodations) }
  end
end
