module Rooms
  class StarsController < ApplicationController
    before_action :require_current_user!

    def create
      room = Room.find_by!(handle: params.fetch(:room_id))
      room_star = room.star!(current_user)

      render json: RoomStarSerializer.render(
        room_star,
        user: current_user,
      )
    end

    def destroy
      room = Room.find_by!(handle: params.fetch(:room_id))
      room_star = room.unstar!(current_user)

      render json: RoomStarSerializer.render(
        room_star,
        user: current_user,
      )
    end
  end
end
