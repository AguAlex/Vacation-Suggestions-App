Rails.application.routes.draw do
  resources :accomodations
  resources :points_of_interests
  resources :cities
  resources :countries, only: [:index, :show]
  resources :users

  resources :accomodations do
    get 'liked/:user_id', to: 'likes#liked'
    post 'like/:user_id', to: 'likes#create'
    delete 'unlike/:user_id', to: 'likes#destroy'
  end

  get '/top_accomodations', to: 'accomodations#top_accomodations'

  # post '/users/login', to: 'users#login'
  post '/login', to: 'sessions#create'
  post 'sessions', to: 'sessions#create'   # Ruta pentru login
  delete 'sessions', to: 'sessions#destroy' # Ruta pentru logout (opțional pentru JWT)
end
