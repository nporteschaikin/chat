class RegistrationsController < ApplicationController
  def create
    registration = Registration.create!(registration_params)
    render json: RegistrationSerializer.render(registration)
  end

  private

  def registration_params
    params.require(:registration).permit(
      :handle,
      :display_name,
      :email,
      :password,
      :location_id,
    )
  end
end
