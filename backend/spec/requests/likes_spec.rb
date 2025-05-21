require 'rails_helper'

RSpec.describe "Likes API", type: :request do
  let!(:country) { Country.create!(name: "Romania") }
  let!(:city) { City.create!(name: "Bucuresti", country: country) }
  let!(:user) { User.create!(email: "user#{rand(1000)}@example.com", nume: "Ion", password: "password") }
  let!(:accomodation) do
    Accomodation.create!(
      category: 'Hotel',
      name: 'Hotel Central',
      distance_to_city: 1,
      price: 200,
      rating: 5,
      city: city,
      link: 'http://hotelcentral.ro'
    )
  end

  describe "POST /accomodations/:accomodation_id/like/:user_id" do
    it "creează un like pentru user și accomodation" do
      post "/accomodations/#{accomodation.id}/like/#{user.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['liked']).to be true
      expect(Like.exists?(user: user, accomodation: accomodation)).to be true
    end
  end

  describe "DELETE /accomodations/:accomodation_id/unlike/:user_id" do
    before do
      Like.create!(user: user, accomodation: accomodation)
    end

    it "șterge like-ul existent" do
      delete "/accomodations/#{accomodation.id}/unlike/#{user.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['liked']).to be false
      expect(Like.exists?(user: user, accomodation: accomodation)).to be false
    end
  end

  describe "GET /accomodations/:accomodation_id/liked/:user_id" do
    context "când userul a dat like" do
      before do
        Like.create!(user: user, accomodation: accomodation)
      end

      it "returnează liked: true" do
        get "/accomodations/#{accomodation.id}/liked/#{user.id}"

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['liked']).to be true
      end
    end

    context "când userul nu a dat like" do
      it "returnează liked: false" do
        get "/accomodations/#{accomodation.id}/liked/#{user.id}"

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['liked']).to be false
      end
    end
  end
end
