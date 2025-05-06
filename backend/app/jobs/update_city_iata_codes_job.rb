class UpdateCityIataCodesJob < ApplicationJob
  queue_as :default

  def perform
    cities_without_code = City.where(iata_code: nil)
    access_token = AmadeusService.get_access_token


    cities_without_code.find_each do |city|
      # Înlocuiește asta cu metoda ta reală din AmadeusService
      cities = AmadeusService.get_cities(city.name,access_token)

      if cities.present?
        city.update(iata_code: cities.first["iataCode"])
        Rails.logger.info "Updated #{city.name} with IATA code: #{}"
      else
        Rails.logger.warn "No IATA code found for city: #{city.name}"
      end
    end
  end
end
