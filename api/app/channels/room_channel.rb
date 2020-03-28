class RoomChannel < ApplicationCable::Channel
  MessageCreatedEvent = Class.new(Event)
  MessageUpdatedEvent = Class.new(Event)
  KeydownEvent        = Class.new(Event)

  Keydown = Struct.new(:user, :received_at)

  class KeydownSerializer < ApplicationSerializer
    time_fields :received_at

    field :user_id do |keydown|
      keydown.user.id
    end

    field :user_handle do |keydown|
      keydown.user.handle
    end

    field :user_avatar_url do |keydown|
      keydown.user.avatar.url
    end
  end

  def subscribed
    room = current_user.visible_rooms.find(params.fetch(:id))
    stream_for(room)
  end

  def keydown
    self.class.broadcast_event_to(
      current_user.visible_rooms.find(params.fetch(:id)),
      KeydownEvent,
      KeydownSerializer.render_as_hash(
        Keydown.new(current_user, Time.now),
      ),
    )
  end
end
