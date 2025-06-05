Rails.application.routes.draw do
  resources :accomodations
  resources :points_of_interests
  resources :cities
  resources :countries, only: [:index, :show]
  resources :users


  get '/api/points_of_interests', to: 'points_of_interests#index'
  get '/api/cities', to: 'cities#index'
  get '/api/airports', to: 'airports#index'
  resources :accomodations do
    get 'liked/:user_id', to: 'likes#liked'
    post 'like/:user_id', to: 'likes#create'
    delete 'unlike/:user_id', to: 'likes#destroy'
  end

  # /users/:id/likes
  resources :users do
    get 'likes', on: :member 
        # Subresursa pentru recommended pentru fiecare utilizator
      # get 'recommended' , on: :member
  end

  post 'users/login', to: 'users#login'
 
  get '/users/:user_id/recommended', to: 'recommended#recommended'

  get '/top_accomodations', to: 'accomodations#top_accomodations'
  
  # get "/api/recommended", to: "recommended#recommended"
  


  # post '/users/login', to: 'users#login'
  post '/login', to: 'sessions#create'
  post 'sessions', to: 'sessions#create'   # Ruta pentru login
  delete 'sessions', to: 'sessions#destroy' # Ruta pentru logout (opțional pentru JWT)
  post '/sessions', to: 'sessions#create'
  post '/sessions/google', to: 'sessions#google'
  namespace :api do
    post 'chat', to: 'chat#create'
  end
  # post '/api/chat' to:'chat#create'
end
