Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get 'test/index', to: 'test#index'
end
