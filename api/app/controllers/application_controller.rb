class ApplicationController < ActionController::API
  include Authentication

  rescue_from Authentication::AuthenticationError, UserToken::AuthenticationError do
    render status: 401, json: {}
  end
end
