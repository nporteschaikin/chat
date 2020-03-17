class ManifestsController < ApplicationController
  Manifest = Struct.new(:user)

  before_action :require_current_user!

  def show
    render json: ManifestSerializer.render(
      Manifest.new(current_user),
      user: current_user,
    )
  end
end
