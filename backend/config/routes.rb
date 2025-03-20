Rails.application.routes.draw do
  resources :accomodations
  resources :points_of_interests
  resources :cities
  resources :countries
  resources :users
  get "up" => "rails/health#show", as: :rails_health_check
  get 'test/index', to: 'test#index'
end
