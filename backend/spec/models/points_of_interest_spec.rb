require 'rails_helper'

RSpec.describe PointsOfInterest, type: :model do
  describe 'validari' do
    let(:country) { Country.create!(name: 'Italia') }
    let(:city) { City.create!(name: 'Roma', country: country) }

    it 'este valid cu nume si oras asociat' do
      poi = PointsOfInterest.new(name: 'Colosseum', city: city)
      expect(poi).to be_valid
    end

    it 'nu este valid fara nume' do
      poi = PointsOfInterest.new(name: nil, city: city)
      expect(poi).to_not be_valid
    end

    it 'nu este valid fara oras asociat' do
      poi = PointsOfInterest.new(name: 'Fontana di Trevi', city: nil)
      expect(poi).to_not be_valid
    end
  end

  describe 'asocieri' do
    it { should belong_to(:city) }
  end
end
