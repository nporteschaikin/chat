module Authentication
  AuthenticationError = Class.new(StandardError)

  def require_current_user!
    raise AuthenticationError if current_user.nil?
  end

  def current_user
    @current_user ||=
      begin
        if (token = request.headers["Authorization"]).present?
          user_token = UserToken.decode(token)
          user_token&.user or raise AuthenticationError
        end
      end
  end
end
