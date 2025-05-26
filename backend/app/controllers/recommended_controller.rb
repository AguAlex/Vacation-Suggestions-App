class RecommendedController < ApplicationController
  before_action :set_user

  def recommended
    user = @user

    city_ids = user.likes
                  .includes(:accomodation)
                  .map { |like| like.accomodation.city_id }
                  .uniq

    cities = City.where(id: city_ids)
    city_codes = cities.pluck(:iata_code).compact.uniq

    access_token = AmadeusService.get_access_token
    raw_data = []

    city_codes.each do |code|
      recommendations = AmadeusService.get_recommendations_by_city_code(code, access_token)
      raw_data.concat(recommendations) if recommendations.present?
    end

    enriched_data = raw_data.uniq { |item| item["iataCode"] }.map do |item|
      iata = item["iataCode"]
      local_city = City.includes(:country).find_by(iata_code: iata)

      if local_city && local_city.country
        country = local_city.country
        item.merge(
          "country_name" => country.name,
          "country_id" => country.id,
          "country_image" => country.image
        )
      else
        item
      end
    end

    if enriched_data.any?
      render json: enriched_data
    else
      render json: { error: "Failed to fetch any recommendations" }, status: :bad_gateway
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end
end
