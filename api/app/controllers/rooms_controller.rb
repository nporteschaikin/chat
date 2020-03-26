class RoomsController < ApplicationController
  def index
    rooms = Room.search(params.fetch(:q))

    render json: RoomSerializer.render(rooms, user: current_user)
  end

  def popular
    rooms = Room.order_by_popularity(30.days.ago...Time.now).limit(10)

    render json: RoomSerializer.render(rooms, user: current_user)
  end
end
