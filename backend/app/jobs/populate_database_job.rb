class PopulateDatabaseJob < ApplicationJob
  queue_as :default
  require_dependency "amadeus_service"
  require_dependency "city_id_generator"

  def perform
    # Obține token-ul de acces
    access_token = AmadeusService.get_access_token


    while true
      # Solicită utilizatorului să introducă un cuvânt cheie
      print "Introdu un cuvânt cheie pentru orașe (sau 'exit' pentru a ieși): "
      keyword = gets.chomp

      # Dacă utilizatorul introduce 'exit', ieșim din loop
      break if keyword.downcase == "exit"

      # Invocă funcția pentru a obține orașele corespunzătoare
      cities = AmadeusService.get_cities(keyword, access_token)
      # if cities.is_a?(String)
      #   begin
      #     Rails.logger.info "askf"  # Pentru logare de tip info

      #     cities = JSON.parse(cities)
      #   rescue JSON::ParserError => e
      #     Rails.logger.error "JSON Parse Error: #{e.message} - "
      #     cities = {}
      #   end
      # end
      first_city = cities.first
      if first_city
        Rails.logger.info "First City: #{first_city.inspect}"
      else
        Rails.logger.info "No cities found"
      end

      # Rails.logger.info @@city_ids
      # city_id=CityIdGenerator.get_city_id(first_city["name"])

      country_name=AmadeusService.get_country_name_by_code(first_city["address"]["countryCode"])

      # # Debugging - check the class and content of cities_data
      # Rails.logger.debug "cities_data: #{cities_data.inspect}"
      # Rails.logger.debug "cities_data class: #{cities_data.class}"
      # cities_data.each do |city_data|
      # Creează sau găsește țara
      country = Country.find_or_create_by(name: country_name)

      # Creează orașul asociat
      city = City.find_or_create_by(name: first_city["name"], country: country)
      # city.latitude, city.longitude = get_city_coordinates(city_data[:name])
      latitude = first_city["geoCode"]["latitude"]
      longitude = first_city["geoCode"]["longitude"]

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
          city_id: city.id,
          category: activity["type"],
          description: activity["description"], # Înlocuit `shortDescription` cu `description`
          price: activity["price"]&.dig("amount")&.to_f || 0.0, # Evită nil errors
          rating: activity["rating"]&.to_f || 0.0, # Evită nil errors
          link: activity["bookingLink"] || activity["self"]["href"], # Fallback la `self["href"]`
          image: (activity["pictures"] || []).join(", ") # Evită nil errors
        )
        end
        hotels = AmadeusService.get_hotels(first_city["iataCode"], access_token)

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
          acc.city_id = city.id  # Înlocuiește cu city_id corect
          acc.rating = hotel["rating"]&.to_f.presence || rand(3..5)  # Folosește rating-ul real sau random
          acc.price = hotel.dig("price", "amount")&.to_f.presence || rand(100..1000)  # Evită nil
          acc.link = hotel["bookingLink"].presence || " "
          acc.imagine = (hotel["pictures"] || []).join(", ")  # Verifică dacă există imagini
        end
      end
    end
  end

  private
end
