class RecommendedController < ApplicationController
  before_action :set_user

  def recommended
    # Pas 1: Obține utilizatorul
    user = @user  # Păstrează obiectul, nu doar id-ul

    # Pas 2: Extrage toate city_id-urile din accommodations pe care le-a dat like
    city_ids = user.likes
                   .includes(:accomodation)
                   .map { |like| like.accomodation.city_id }
                   .uniq

    # Obține orașele corespunzătoare city_id-urilor
    cities = City.where(id: city_ids)
    city_codes = cities.pluck(:iata_code).compact.uniq

    access_token = AmadeusService.get_access_token
    data = []
    
    city_codes.each do |code|
      recommendations = AmadeusService.get_recommendations_by_city_code(code, access_token)
      data.concat(recommendations) if recommendations.present?
    end
    data.uniq! { |item| item["iataCode"] }
    
    if data.any?
      render json: data
    else
      render json: { error: "Failed to fetch any recommendations" }, status: :bad_gateway
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end
end
