json.extract! points_of_interest, :id, :name, :rating, :category, :city_id, :created_at, :updated_at
json.url points_of_interest_url(points_of_interest, format: :json)
