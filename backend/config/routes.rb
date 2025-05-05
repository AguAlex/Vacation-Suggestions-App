Rails.application.routes.draw do
  resources :accomodations
  resources :points_of_interests
  resources :cities
  resources :countries, only: [:index, :show]
  resources :users

  get '/api/points_of_interest', to: 'points_of_interest#index'
  get '/api/cities', to: 'cities#index'

  # post '/users/login', to: 'users#login'
  post '/login', to: 'sessions#create'
  post 'sessions', to: 'sessions#create'   # Ruta pentru login
  delete 'sessions', to: 'sessions#destroy' # Ruta pentru logout (opțional pentru JWT)
  namespace :api do
    post 'chat', to: 'chat#create'
  end
  # post '/api/chat' to:'chat#create'
end
