class Avatar
  GRAVATAR_URL_FORMAT = "https://gravatar.com/avatar/%s".freeze

  def initialize(resource)
    @resource = resource
  end

  def url
    if resource.try(:email).present?
      GRAVATAR_URL_FORMAT % Digest::MD5.hexdigest(resource.email)
    else
      ActionController::Base.helpers.asset_path("default-avatar.svg")
    end
  end

  def blueprint
    AvatarSerializer
  end

  private

  attr_reader :resource
end
