class PopulateDatabaseJob < ApplicationJob
  queue_as :default

  def perform
    # Obține token-ul de acces
    access_token = AmadeusService.get_access_token

    # Exemplu de orașe
    cities_data = [
      { name: "London", country_name: "United Kingdom" },
      { name: "New York", country_name: "United States" },
      { name: "Los Angeles", country_name: "United States" },
      { name: "Paris", country_name: "France" },
      { name: "Berlin", country_name: "Germany" },
      { name: "Rome", country_name: "Italy" },
      { name: "Tokyo", country_name: "Japan" },
      { name: "Madrid", country_name: "Spain" },
      { name: "Sydney", country_name: "Australia" }
    ]


    # Debugging - check the class and content of cities_data
    Rails.logger.debug "cities_data: #{cities_data.inspect}"
    Rails.logger.debug "cities_data class: #{cities_data.class}"
    cities_data.each do |city_data|
      # Creează sau găsește țara
      country = Country.find_or_create_by(name: city_data[:country_name])

      # Creează orașul asociat
      city = City.find_or_create_by(name: city_data[:name], country: country)
      # city.latitude, city.longitude = get_city_coordinates(city_data[:name])

      latitude, longitude = get_city_coordinates(city_data[:name])

        # Obține activitățile
        activities = AmadeusService.get_activities(latitude, longitude, 5, access_token)
        # activities = JSON.parse(activities) if activities.is_a?(String)
        # Rails.logger.info "Activities Response: #{activities}"

        # Rails.logger.info "Raw API Response: #{activities.class} - #{activities.inspect}"
        if activities.is_a?(String)
          begin
            activities = JSON.parse(activities)
          rescue JSON::ParserError => e
            Rails.logger.error "JSON Parse Error: #{e.message} - Response: #{activities.inspect}"
            activities = {}  # Setează un hash gol pentru a evita crash-uri
          end
        end

        # Verifică dacă răspunsul este un hash și conține cheia "data"
        if activities.is_a?(Hash) && activities.key?("data")
          activities = activities["data"]
        else
          Rails.logger.error "Unexpected API response format: #{activities.inspect}"
          activities = []
        end

        Rails.logger.info "Final Activities Data: #{activities.inspect}"

        activities.each do |activity|
          PointsOfInterest.create(
            name: activity["name"],
            description: activity["shortDescription"],
            price: activity.dig("price", "amount")&.to_f || 0.0, # Evită nil errors
            rating: activity["rating"]&.to_f || 0.0, # Evită nil errors
            link: activity["bookingLink"],
            image: (activity["pictures"] || []).join(", ") # Evită nil errors
          )
        end
      # Obține hotelurile
      hotels = AmadeusService.get_hotels(get_city_code(city_data[:name]), access_token)

      if hotels.is_a?(Hash) && hotels.key?("data")
        hotels = hotels["data"]
      else
        Rails.logger.error "Unexpected API response format: #{hotels.inspect}"
        hotels = []
      end

      # Procesare fiecare hotel
      hotels.each do |hotel|
        # Asigură-te că datele sunt disponibile și valide
        Accomodation.create(
          name: hotel["name"],
          distance_to_city: hotel.dig("distance", "value").to_f || 0.0,  # Evită nil errors
          category: "hotel",
          city_id: 2,  # Presupun că ai o metodă de a determina city_id corect
          rating: hotel["rating"].to_f || rand(3..5),  # Folosește ratingul real sau generează un random între 3 și 5
          price: hotel["price"]&.dig("amount")&.to_f || rand(100..1000),  # Preț real sau random
          link: hotel["bookingLink"] || " ",  # Asigură-te că există un link valid
          imagine: (hotel["pictures"] || []).join(", ")  # Asigură-te că nu există erori la concatenarea imaginilor
        )
      end
    end
  end

  private

  def get_city_code(city_name)
    city_codes = {
      "London" => "LON",
      "London, UK" => "LON",
      "New York" => "NYC",
      "Los Angeles" => "LAX",
      "Paris" => "PAR",
      "Berlin" => "BER",
      "Rome" => "ROM",
      "Tokyo" => "TYO",
      "Madrid" => "MAD",
      "Sydney" => "SYD"
    }
    city_codes[city_name] || "N/A"
  end

  def get_city_coordinates(city_name)
    case city_name
    when "London"
      [ 51.5074, -0.1278 ]
    when "New York"
      [ 40.7128, -74.0060 ]
    when "Los Angeles"
      [ 34.0522, -118.2437 ]
    when "Paris"
      [ 48.8566, 2.3522 ]
    when "Berlin"
      [ 52.52, 13.405 ]
    when "Rome"
      [ 41.9028, 12.4964 ]
    when "Tokyo"
      [ 35.6762, 139.6503 ]
    when "Madrid"
      [ 40.4168, -3.7038 ]
    when "Sydney"
      [ -33.8688, 151.2093 ]
    else
      [ 0.0, 0.0 ]
    end
  end
end
