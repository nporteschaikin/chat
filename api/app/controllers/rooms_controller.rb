class RoomsController < ApplicationController
  before_action :require_current_user!, only: %i(open close star)

  def index
    rooms = Room.search(params.fetch(:q))

    render json: RoomSerializer.render(rooms, user: current_user)
  end

  def popular
    rooms = Room.order_by_popularity(30.days.ago...Time.now).limit(10)

    render json: RoomSerializer.render(rooms, user: current_user)
  end

  def show
    room = Room.find_by!(handle: params.fetch(:id))

    render json: RoomSerializer.render(room, user: current_user)
  end

  def open
    room = Room.find_by!(handle: params.fetch(:id))
    room.open_for!(current_user)

    render json: RoomSerializer.render(room, user: current_user)
  end

  def close
    room = Room.find_by!(handle: params.fetch(:id))
    room.close_for!(current_user)

    render json: RoomSerializer.render(room, user: current_user)
  end
end
