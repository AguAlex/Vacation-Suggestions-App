require 'rails_helper'

RSpec.describe "Airports API", type: :request do
  let!(:country) { Country.create!(name: "România") }
  let!(:city) { City.create!(name: "București", country: country) }
  let!(:airport1) { Airport.create!(name: "Otopeni", city: city, iata_code: "OTP") }
  let!(:airport2) { Airport.create!(name: "Cluj Airport", city: city, iata_code: "CLJ") }

  # describe "GET /airports" do
  #   it "returnează toate aeroporturile" do
  #     get "/airports"
  #     expect(response).to have_http_status(:ok)
  #     expect(JSON.parse(response.body).length).to eq(2)
  #   end
  # end
end
