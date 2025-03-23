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
      { name: "Sydney", country_name: "Australia" },
      { name: "Dubai", country_name: "United Arab Emirates" },
      { name: "Istanbul", country_name: "Turkey" },
      { name: "Bangkok", country_name: "Thailand" },
      { name: "Barcelona", country_name: "Spain" },
      { name: "Amsterdam", country_name: "Netherlands" },
      { name: "Singapore", country_name: "Singapore" },
      { name: "Hong Kong", country_name: "China" },
      { name: "Prague", country_name: "Czech Republic" },
      { name: "Moscow", country_name: "Russia" },
      { name: "Vienna", country_name: "Austria" }
    ]


    # Debugging - check the class and content of cities_data
    Rails.logger.debug "cities_data: #{cities_data.inspect}"
    Rails.logger.debug "cities_data class: #{cities_data.class}"
    cities_data.each do |city_data|
      # Creează sau găsește țara
      country = Country.find_or_create_by(name: city_data[:country_name])

      # Creează orașul asociat
      city = City.find_or_create_by(id: get_city_id(city_data[:name]), name: city_data[:name], country: country)
      # city.latitude, city.longitude = get_city_coordinates(city_data[:name])

      latitude, longitude = get_city_coordinates(city_data[:name])

      activities = AmadeusService.get_activities(latitude, longitude, 5, access_token)
      if activities.is_a?(String)
        begin
          Rails.logger.info "askf"  # Pentru logare de tip info

          activities = JSON.parse(activities)
        rescue JSON::ParserError => e
          Rails.logger.error "JSON Parse Error: #{e.message} - "
          activities = {}
        end
      end
      Rails.logger.info "activities Response Type: #{activities.class}"

        # Rails.logger.info "Final Activities Data: #{activities.inspect}"

        (activities).take(3).each do |activity|
          Rails.logger.info(activity.inspect)
          Rails.logger.info "poi"  # Pentru logare de tip info

          PointsOfInterest.find_or_create_by(
          # id: activity["id"],
          name: activity["name"],
          city_id: get_city_id(city_data[:name]),
          category: activity["type"],
          description: activity["description"], # Înlocuit `shortDescription` cu `description`
          price: activity["price"]&.dig("amount")&.to_f || 0.0, # Evită nil errors
          rating: activity["rating"]&.to_f || 0.0, # Evită nil errors
          link: activity["bookingLink"] || activity["self"]["href"], # Fallback la `self["href"]`
          image: (activity["pictures"] || []).join(", ") # Evită nil errors
        )
        end
        hotels = AmadeusService.get_hotels(get_city_code(city_data[:name]), access_token)

        # Dacă este un string, îl parsez. Dacă nu, îl folosesc direct.
        if hotels.is_a?(String)
          begin
            Rails.logger.info "hotels"  # Pentru logare de tip info

            hotels = JSON.parse(hotels)
          rescue JSON::ParserError => e
            Rails.logger.error "JSON Parse Error: #{e.message} - "
            hotels = {}
          end
        end

        Rails.logger.info "Hotels Response Type: #{hotels.class}"


      # Procesare fiecare hotel
      (hotels).take(3).each do |hotel|
        Rails.logger.info("hotel")
        Rails.logger.info(hotel.inspect)
        # Asigură-te că datele sunt disponibile și valide
        Accomodation.find_or_create_by(name: hotel["name"]) do |acc|
          acc.distance_to_city = hotel.dig("distance", "value").to_f || 0.0  # Evită nil errors
          acc.category = "hotel"
          acc.city_id = get_city_id(city_data[:name])  # Înlocuiește cu city_id corect
          acc.rating = hotel["rating"]&.to_f.presence || rand(3..5)  # Folosește rating-ul real sau random
          acc.price = hotel.dig("price", "amount")&.to_f.presence || rand(100..1000)  # Evită nil
          acc.link = hotel["bookingLink"].presence || " "
          acc.imagine = (hotel["pictures"] || []).join(", ")  # Verifică dacă există imagini
        end
      end
    end
  end

  private

  def get_city_code(city_name)
    city_codes = {
      "London" => "LON",
      "New York" => "NYC",
      "Los Angeles" => "LAX",
      "Paris" => "PAR",
      "Berlin" => "BER",
      "Rome" => "ROM",
      "Tokyo" => "TYO",
      "Madrid" => "MAD",
      "Sydney" => "SYD",
      "Dubai" => "DXB",
      "Istanbul" => "IST",
      "Bangkok" => "BKK",
      "Barcelona" => "BCN",
      "Amsterdam" => "AMS",
      "Singapore" => "SIN",
      "Hong Kong" => "HKG",
      "Prague" => "PRG",
      "Moscow" => "MOW",
      "Vienna" => "VIE"
    }
    city_codes[city_name] || "N/A"
  end

  def get_city_id(city_name)
    city_ids = {
      "London" => 1001,
      "New York" => 1002,
      "Los Angeles" => 1003,
      "Paris" => 1004,
      "Berlin" => 1005,
      "Rome" => 1006,
      "Tokyo" => 1007,
      "Madrid" => 1008,
      "Sydney" => 1009,
      "Dubai" => 1010,
      "Istanbul" => 1011,
      "Bangkok" => 1012,
      "Barcelona" => 1013,
      "Amsterdam" => 1014,
      "Singapore" => 1015,
      "Hong Kong" => 1016,
      "Prague" => 1017,
      "Moscow" => 1018,
      "Vienna" => 1019
    }
    city_ids[city_name] || -1  # -1 dacă orașul nu există
  end

  def get_city_coordinates(city_name)
    coordinates = {
      "London" => [ 51.5074, -0.1278 ],
      "New York" => [ 40.7128, -74.0060 ],
      "Los Angeles" => [ 34.0522, -118.2437 ],
      "Paris" => [ 48.8566, 2.3522 ],
      "Berlin" => [ 52.52, 13.405 ],
      "Rome" => [ 41.9028, 12.4964 ],
      "Tokyo" => [ 35.6762, 139.6503 ],
      "Madrid" => [ 40.4168, -3.7038 ],
      "Sydney" => [ -33.8688, 151.2093 ],
      "Dubai" => [ 25.276987, 55.296249 ],
      "Istanbul" => [ 41.0082, 28.9784 ],
      "Bangkok" => [ 13.7563, 100.5018 ],
      "Barcelona" => [ 41.3851, 2.1734 ],
      "Amsterdam" => [ 52.3676, 4.9041 ],
      "Singapore" => [ 1.3521, 103.8198 ],
      "Hong Kong" => [ 22.3193, 114.1694 ],
      "Prague" => [ 50.0755, 14.4378 ],
      "Moscow" => [ 55.7558, 37.6173 ],
      "Vienna" => [ 48.2082, 16.3738 ]
    }
    coordinates[city_name] || [ 0.0, 0.0 ]
  end
end
