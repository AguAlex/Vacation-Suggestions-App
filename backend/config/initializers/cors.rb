# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001'  # React rulează pe acest port
    resource '*',                    # Permite accesul la toate resursele
      headers: :any,                  # Permite orice tip de headere
      methods: [:get, :post, :put, :patch, :delete, :options, :head]  # Permite aceste metode HTTP
  end
end
