json.extract! user, :id, :nume, :parola, :email, :created_at, :updated_at
json.url user_url(user, format: :json)
