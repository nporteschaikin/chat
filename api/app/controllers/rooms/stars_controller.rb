module Rooms
  class StarsController < ApplicationController
    before_action :require_current_user!

    def create
      room_star = room.star!(current_user)

      render json: RoomStarSerializer.render(
        room_star,
        user: current_user,
      )
    end

    def destroy
      room_star = room.unstar!(current_user)

      render json: RoomStarSerializer.render(
        room_star,
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
