class LocationsController < ApplicationController
  def index
    render json: LocationSerializer.render(Location.order(:human_name))
  end
end
