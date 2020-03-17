class Message < ApplicationRecord
  belongs_to :room
  belongs_to :author, class_name: "User", optional: true

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
end
