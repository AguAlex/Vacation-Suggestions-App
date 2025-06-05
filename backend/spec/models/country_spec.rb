require 'rails_helper'

RSpec.describe Country, type: :model do
  describe 'validari' do
    it 'este valid cu nume' do
      country = Country.new(name: 'Franța')
      expect(country).to be_valid
    end

    it 'nu este valid fara nume' do
      country = Country.new(name: nil)
      expect(country).to_not be_valid
    end
  end

  describe 'asocieri' do
    it { should have_many(:cities) }
  end
end
