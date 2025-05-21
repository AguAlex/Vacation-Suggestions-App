
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validari' do
    it 'este valid cu email, nume si parola' do
      user = User.new(email: 'test@example.com', nume: 'Ion', password: 'password123')
      expect(user).to be_valid
    end

    it 'nu este valid fara email' do
      user = User.new(email: nil, nume: 'Ion', password: 'password123')
      expect(user).to_not be_valid
    end

    it 'nu este valid fara nume' do
      user = User.new(email: 'test@example.com', nume: nil, password: 'password123')
      expect(user).to_not be_valid
    end

    it 'nu este valid fara parola' do
      user = User.new(email: 'test@example.com', nume: 'Ion', password: nil)
      expect(user).to_not be_valid
    end

    it 'nu permite email duplicat' do
      User.create!(email: 'test@example.com', nume: 'Ion', password: 'pass123')
      duplicate_user = User.new(email: 'test@example.com', nume: 'Maria', password: 'pass123')
      expect(duplicate_user).to_not be_valid
    end
  end
end
