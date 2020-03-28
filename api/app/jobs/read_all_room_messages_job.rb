class ReadAllRoomMessagesJob < ApplicationJob
  def perform(user_id, room_id, read_at)
    user = User.find(user_id)
    room = Room.find(room_id)

    room.read_all(user, read_at)
  end
end
