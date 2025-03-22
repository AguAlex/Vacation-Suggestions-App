Rails.application.routes.draw do
  resources :accomodations
  resources :points_of_interests
  resources :cities
  resources :countries
  resources :users

  post '/users/signup', to: 'users#signup'
  post '/users/login', to: 'users#login'
end
