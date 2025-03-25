require "json"

class CityIdGenerator
  FILE_PATH = Rails.root.join("storage", "city_ids.json")

  # Încarcă ID-urile la pornirea aplicației
  def self.load_ids
    if File.exist?(FILE_PATH)
      JSON.parse(File.read(FILE_PATH))
    else
      {} # Returnează un hash gol dacă fișierul nu există
    end
  rescue JSON::ParserError
    {} # Dacă JSON-ul este corupt, returnează un hash gol
  end

  @@city_ids = load_ids

  def self.get_city_id(city_name)
    return @@city_ids[city_name] if @@city_ids.key?(city_name)

    next_id = (@@city_ids.values.max || 1000) + 1
    @@city_ids[city_name] = next_id
    save_ids # Salvăm în fișier
    next_id
  end

  def self.save_ids
    File.write(FILE_PATH, JSON.pretty_generate(@@city_ids))
  end
end
