class RoomOpen < ApplicationRecord
  belongs_to :user
  belongs_to :room

  after_create do
    MessageRead.read_all_for_room(user, room, created_at)
  end
end
