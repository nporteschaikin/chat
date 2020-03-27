module Rooms
  class MessagesController < ApplicationController
    PER_PAGE = 100

    before_action :require_current_user!

    def index
      messages = room.messages.limit(PER_PAGE).
        includes(:author).
        order(created_at: :desc)

      render json: MessageSerializer.render(messages)
    end

    def create
      message = room.messages.create!(
        message_params.merge(
          author: current_user,
        )
      )

      render json: MessageSerializer.render(message)
    end

    private

    def room
      @room ||=
        current_user.visible_rooms.find_by_handle_and_location_handle!(
          params.fetch(:room_handle),
          params[:location_handle],
        )
    end

    def message_params
      params.require(:message).permit(
        :body,
      )
    end
  end
end
