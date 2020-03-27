Rails.application.routes.draw do
  default_url_options host: ENV["API_URL"]

  resource :user_token, path: :auth, only: %i(create)
  resource :registration, only: %i(create)

  resource :manifest, only: %i(show)

  def room_routes
    resources :rooms, param: :handle, only: %i(index) do
      collection do
        get :search
        get :popular
      end

      scope module: :rooms do
        resources :messages, only: %i(index create)
        resource :star, only: %i(create destroy)
        resource :open, only: %i(create destroy)
      end
    end
  end

  room_routes

  resources :locations, param: :handle, only: %i(index) do
    room_routes
  end
end
