class Registration
  class Registrar
    EMAIL_REGEXP = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

    include ActiveModel::Model

    attr_accessor :handle
    attr_accessor :display_name
    attr_accessor :email
    attr_accessor :password
    attr_accessor :location_id

    validates :handle, :email, :display_name, :password, :location, presence: true
    validates :email, format: { with: EMAIL_REGEXP }, unless: -> { email.nil? }

    validate do
      if User.where(handle: handle).any?
        errors.add(:handle, "already taken")
      end
    end

    def register!
      validate!

      Registration.new(
        UserToken.new(
          User.create!(
            handle: handle,
            display_name: display_name,
            email: email,
            password: password,
            location: location,
          ),
        ),
      )
    end

    private

    def location
      @location ||= Location.find_by(id: location_id)
    end
  end

  class << self
    def create!(attributes)
      Registrar.new(attributes).register!
    end
  end

  attr_reader :user_token

  def initialize(user_token)
    @user_token = user_token
  end
end
