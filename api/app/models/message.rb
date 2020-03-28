class Message < ApplicationRecord
  belongs_to :room
  belongs_to :author, class_name: "User", optional: true
  has_many :reads, class_name: "MessageRead"

  after_create do
    UpsertMessageReadsJob.perform_later(id)
  end

  after_create do
    RoomChannel.broadcast_event_to(
      room,
      RoomChannel::MessageCreatedEvent,
      MessageSerializer.render_as_hash(self),
    )
  end

  after_update do
    RoomChannel.broadcast_event_to(
      room,
      RoomChannel::MessageUpdatedEvent,
      MessageSerializer.render_as_hash(self),
    )
  end

  scope :unread_in_room_for, ->(user, room) {
    left_outer_joins(:reads).
      where(room_id: room.id, message_reads: { user_id: user.id, read_at: nil })
  }
end
