Rails.application.routes.draw do
  default_url_options host: ENV["API_URL"]

  resource :user_token, path: :auth, only: %i(create)
  resource :registration, only: %i(create)

  resource :manifest, only: %i(show)

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

  resources :locations, param: :handle, only: %i(index) do
    resources :rooms, param: :handle, only: %i() do
      scope module: :rooms do
        resource :open, only: %i(create destroy)
        resource :star, only: %i(create destroy)
      end
    end
  end
end
