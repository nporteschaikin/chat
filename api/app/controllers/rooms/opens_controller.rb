module Rooms
  class OpensController < ApplicationController
    before_action :require_current_user!

    def create
      room_open = room.open!(current_user)

      render json: RoomOpenSerializer.render(
        room_open,
        user: current_user,
      )
    end

    def destroy
      room_open = room.close!(current_user)

      render json: RoomOpenSerializer.render(
        room_open,
        user: current_user,
      )
    end

    private

    def room
      @room ||=
        current_user.visible_rooms.find_by_handle_and_location_handle!(
          params.fetch(:room_handle),
          params[:location_handle],
        )
    end
  end
end
