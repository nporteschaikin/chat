Rails.application.routes.draw do
  resource :user_token, path: :auth, only: %i(create)
  resource :registration, only: %i(create)

  resource :manifest, only: %i(show)

  resources :rooms, only: %i(index show) do
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
