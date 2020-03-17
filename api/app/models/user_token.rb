class UserToken
  AuthenticationError = Class.new(StandardError)

  class << self
    def key
      Rails.application.secret_key_base
    end

    def decode(token)
      payload = JWT.decode(token, key)[0]
      user    = User.find_by(id: payload["user_id"])

      if user.present?
        new(user, Time.at(payload["exp"]))
      end
    rescue JWT::DecodeError
      nil
    end

    def create!(params)
      user = User.find_by(email: params.fetch(:email))

      if user.present? && user.authenticate(params.fetch(:password))
        new(user)
      else
        raise AuthenticationError
      end
    end
  end

  attr_reader :user, :expires_at

  def initialize(user, expires_at = Time.now + 24.hours)
    @user       = user
    @expires_at = expires_at
  end

  def token
    JWT.encode(payload, self.class.key)
  end

  private

  def payload
    {
      user_id: user.id,
      exp:     expires_at.to_i,
    }
  end
end
