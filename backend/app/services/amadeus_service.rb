# app/services/amadeus_service.rb

require "httparty"
require "dotenv/load"


class AmadeusService
  API_KEY = ENV["API_KEY"]
  API_SECRET = ENV["API_SECRET"]

  def self.get_access_token
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    response = HTTParty.post(url, body: {
      grant_type: "client_credentials",
      client_id: API_KEY,
      client_secret: API_SECRET
    })

    response.parsed_response["access_token"]
  end


  def self.get_cities(keyword, access_token)
    url = "https://test.api.amadeus.com/v1/reference-data/locations/cities"

    response = HTTParty.get(url, query: {
      keyword: keyword,
      max: 10,           # Limit the number of results
      include: "AIRPORTS" # Include airports in the response
    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })

    begin
      parsed_response = JSON.parse(response.body)

      # Verificăm dacă răspunsul conține cheia "data" și returnăm doar "data"
      if parsed_response.is_a?(Hash) && parsed_response.key?("data")
        parsed_response["data"]
      else
        # Dacă nu există cheia "data", returnăm un array gol
        []
      end
    rescue JSON::ParserError => e
      # În cazul în care apare o eroare la parsing, returnăm un array gol
      Rails.logger.error "JSON Parse Error: #{e.message}"
      []
    rescue TypeError, NoMethodError => e
      # În cazul în care apar erori de tip sau acces la metode inexistent, returnăm un array gol
      Rails.logger.error "Error: #{e.message}"
      []
    end
  end

  def self.get_iata_code_for_city(city_name,access_token)

    response = HTTParty.get("https://test.api.amadeus.com/v1/reference-data/locations/cities",
      query: {
        keyword: city_name,
        subType: 'CITY',
        page: { limit: 1 }
      },
      headers: {
        "Authorization" => "Bearer #{access_token}"
      }
    )

    if response.success? && response['data'].present?
      response['data'][0]['iataCode']
    else
      nil
    end
  end

  def self.get_country_name_by_code(country_code)
    url = "https://restcountries.com/v3.1/alpha/#{country_code}"

    response = HTTParty.get(url)

    begin
      # Verificăm dacă răspunsul este OK
      if response.code == 200
        country_data = response.parsed_response
        country_name = country_data[0]["name"]["common"]
        country_name
      else
        Rails.logger.error "Error: Unable to retrieve country data"
        nil
      end
    rescue HTTParty::Error => e
      # În caz de eroare HTTP
      Rails.logger.error "HTTP Error: #{e.message}"
      nil
    rescue StandardError => e
      # În caz de eroare generală
      Rails.logger.error "Error: #{e.message}"
      nil
    end
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

    # Verifică dacă răspunsul este un succes
    if response.success?
      # Încearcă să parsezi răspunsul JSON
      begin
        parsed_response = JSON.parse(response.body)

        # Verifică dacă "data" există în răspunsul JSON
        if parsed_response.is_a?(Hash) && parsed_response.key?("data")
          parsed_response["data"]  # Returnează datele din API
        else
          # Rails.logger.error "Unexpected API response structure: #{parsed_response.inspect}"
          []  # Returnează un array gol dacă nu există "data"
        end
      rescue JSON::ParserError => e
        Rails.logger.error "JSON Parsing Error: #{e.message} - Response Body: "
        []  # Returnează un array gol în caz de eroare la parse
      end
    else
      Rails.logger.error "API Request failed with status: #{response.code} - "
      []  # Returnează un array gol în caz de eroare de rețea sau API
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
    # Rails.logger.info("Raw API Response: #{response.body}")

    begin
      parsed_response = JSON.parse(response.body)

      # Verificăm dacă răspunsul este un Hash și are cheia "data"
      if parsed_response.is_a?(Hash) && parsed_response.key?("data")
        parsed_response["data"]
      else
        # Rails.logger.error("Unexpected API response format: #{parsed_response.inspect}")
        []
      end
    rescue JSON::ParserError => e
      # Rails.logger.error("JSON Parse Error: #{e.message} - Response: #{response.body}")
      []
    rescue TypeError, NoMethodError => e
      # Rails.logger.error("Type Error: #{e.message} - Parsed Response: #{parsed_response.inspect}")
      []
    end
  end

  def self.get_recommendations_by_city_code(city_code, access_token)
    url = "https://test.api.amadeus.com/v1/reference-data/recommended-locations"
  
    response = HTTParty.get(url, query: {
      cityCodes: city_code
    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })
  
    begin
      parsed_response = JSON.parse(response.body)
  
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
    # Rails.logger.info("Raw API Response: #{response.body}")

    begin
      parsed_response = JSON.parse(response.body)

      # Verificăm dacă răspunsul este un Hash și are cheia "data"
      if parsed_response.is_a?(Hash) && parsed_response.key?("data")
        parsed_response["data"]
      else
        # Rails.logger.error("Unexpected API response format: #{parsed_response.inspect}")
        []
      end
    rescue JSON::ParserError => e
      # Rails.logger.error("JSON Parse Error: #{e.message} - Response: #{response.body}")
      []
    rescue TypeError, NoMethodError => e
      # Rails.logger.error("Type Error: #{e.message} - Parsed Response: #{parsed_response.inspect}")
      []
    end
  end




  def self.get_airport_routes(airport_code,country_code, access_token)
    url = "https://test.api.amadeus.com/v1/reference-data/recommended-locations"
  
    response = HTTParty.get(url, query: {
      departureAirportCode: airport_code,
      arrivalCountryCode: country_code

    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })
  
    begin
      parsed_response = JSON.parse(response.body)
  
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


  def self.get_airports(latitude,longitude, access_token)
    url = "https://test.api.amadeus.com/v1/reference-data/locations/airports"

    response = HTTParty.get(url, query: {
      latitude: latitude,
      longitude:longitude,
      radius: 50
    }, headers: {
      "Authorization" => "Bearer #{access_token}"
    })

    # Log pentru debugging
    # Rails.logger.info("Raw API Response: #{response.body}")

    begin
      parsed_response = JSON.parse(response.body)

      # Verificăm dacă răspunsul este un Hash și are cheia "data"
      if parsed_response.is_a?(Hash) && parsed_response.key?("data")
        parsed_response["data"]
      else
        # Rails.logger.error("Unexpected API response format: #{parsed_response.inspect}")
        []
      end
    rescue JSON::ParserError => e
      # Rails.logger.error("JSON Parse Error: #{e.message} - Response: #{response.body}")
      []
    rescue TypeError, NoMethodError => e
      # Rails.logger.error("Type Error: #{e.message} - Parsed Response: #{parsed_response.inspect}")
      []
    end
  end
  
  end
