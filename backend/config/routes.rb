Rails.application.routes.draw do
  resources :accomodations
  resources :points_of_interests
  resources :cities
  resources :countries
  resources :users

  
  # post '/users/login', to: 'users#login'
  post '/login', to: 'sessions#create'
  post 'sessions', to: 'sessions#create'   # Ruta pentru login
  delete 'sessions', to: 'sessions#destroy' # Ruta pentru logout (opțional pentru JWT)
end
