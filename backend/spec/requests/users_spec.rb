
require 'rails_helper'

RSpec.describe "Users API", type: :request do
  let!(:user) { User.create!(email: "test@example.com", nume: "Ion", password: "password123") }

  describe "GET /users" do
    it "returneaza lista de useri" do
      get "/users"
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to be_an(Array)
    end
  end

  describe "GET /users/:id" do
    it "returneaza un user" do
      get "/users/#{user.id}"
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["email"]).to eq("test@example.com")
    end
  end

  describe "POST /users" do
    it "creeaza un user valid" do
      post "/users", params: {
        user: {
          email: "new@example.com",
          nume: "Ana",
          password: "123456"
        }
      }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["user"]["email"]).to eq("new@example.com")
    end

    it "returneaza eroare pentru date invalide" do
      post "/users", params: { user: { email: "", nume: "", password: "" } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include("Email can't be blank")
    end
  end

  describe "POST /users/login" do
    it "autentifica userul cu date corecte" do
      post "/users/login", params: { email: "user1@gmail.com", parola: "user1" }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["message"]).to eq("Autentificare reușită")
    end

    it "returneaza eroare cu date gresite" do
      post "/users/login", params: { email: "test@example.com", parola: "gresit" }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)["message"]).to eq("Email sau parolă greșită")
    end
  end
end
