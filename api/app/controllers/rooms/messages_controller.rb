module Rooms
  class MessagesController < ApplicationController
    PER_PAGE = 100

    before_action :require_current_user!, only: %i[create]

    def index
      room = Room.find_by!(handle: params.fetch(:room_id))
      messages = room.messages.limit(PER_PAGE).
        includes(:author).
        order(created_at: :desc)

      render json: MessageSerializer.render(messages)
    end

    def create
      room = Room.find_by!(handle: params.fetch(:room_id))
      message = room.messages.create!(
        message_params.merge(
          author: current_user,
        )
      )

      render json: MessageSerializer.render(message)
    end

    private

    def message_params
      params.require(:message).permit(
        :body,
      )
    end
  end
end
