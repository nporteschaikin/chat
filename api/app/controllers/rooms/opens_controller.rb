module Rooms
  class OpensController < ApplicationController
    before_action :require_current_user!

    def create
      room = Room.find_by!(handle: params.fetch(:room_id))
      room_open = room.open!(current_user)

      render json: RoomOpenSerializer.render(
        room_open,
        user: current_user,
      )
    end

    def destroy
      room = Room.find_by!(handle: params.fetch(:room_id))
      room_open = room.close!(current_user)

      render json: RoomOpenSerializer.render(
        room_open,
        user: current_user,
      )
    end
  end
end
