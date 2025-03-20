# app/services/amadeus_service.rb

require "httparty"

class AmadeusService
  API_KEY = "ZDp910zHnp4aiOWDyV19L8UNmJHUORCt"
  API_SECRET = "V1Sl0ogXERAnNDrv"

  def self.get_access_token
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    response = HTTParty.post(url, body: {
      grant_type: "client_credentials",
      client_id: API_KEY,
      client_secret: API_SECRET
    })

    response.parsed_response["access_token"]
  end

  def self.get_activities(latitude, longitude, radius, access_token)
    url = "https://test.api.amadeus.com/v1/shopping/activities"

    response = HTTParty.get(url, query: {
      latitude: latitude,
      longitude: longitude,
      radius: radius
    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })

    # Loghează răspunsul API-ului pentru debugging
    # Rails.logger.info "Amadeus API Raw Response: #{response.body.inspect}"

    # Asigură-te că răspunsul este JSON valid
    begin
      parsed_response = JSON.parse(response.body)
      # Rails.logger.info "Parsed Response: #{parsed_response.inspect}"
      parsed_response
    rescue JSON::ParserError => e
      Rails.logger.error "JSON Parsing Error: #{e.message} - "
      {} # Returnează un hash gol pentru a evita crash-uri
    end
  end

  def self.get_hotel_details(hotel_id, access_token)
    url = "https://test.api.amadeus.com/v3/shopping/hotel-offers"
    response = HTTParty.get(url, query: {
      hotelIds: [ hotel_id ]
    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })
    # Log pentru debugging
    #  Rails.logger.info("API Response: #{response.body}")
    response.parsed_response["data"] || []
  end
  def self.get_hotels(city_code, access_token)
    url = "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city"

    response = HTTParty.get(url, query: {
      cityCode: city_code,
      radius: 5,
      radiusUnit: "KM",
      hotelSource: "ALL"
    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })

    # Log pentru debugging
    Rails.logger.info("Raw API Response: #{response.body}")

    begin
      parsed_response = JSON.parse(response.body)

      # Verificăm dacă răspunsul este un Hash și are cheia "data"
      if parsed_response.is_a?(Hash) && parsed_response.key?("data")
        parsed_response["data"]
      else
        Rails.logger.error("Unexpected API response format: #{parsed_response.inspect}")
        []
      end
    rescue JSON::ParserError => e
      Rails.logger.error("JSON Parse Error: #{e.message} - Response: #{response.body}")
      []
    rescue TypeError, NoMethodError => e
      Rails.logger.error("Type Error: #{e.message} - Parsed Response: #{parsed_response.inspect}")
      []
    end
  end
end
