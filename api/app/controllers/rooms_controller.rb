class RoomsController < ApplicationController
  before_action :require_current_user!

  def index
    rooms = current_user.visible_rooms.search(params.fetch(:q))

    render json: RoomSerializer.render(rooms, user: current_user)
  end

  def popular
    rooms = current_user.visible_rooms.order_by_popularity(30.days.ago...Time.now).limit(10)

    render json: RoomSerializer.render(rooms, user: current_user)
  end
end
