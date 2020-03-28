class MessageRead < ApplicationRecord
  belongs_to :message
  belongs_to :user

  scope :for_room_and_user, ->(room, user) {
    joins(:message).
      where(messages: { room_id: room.id }, user_id: user.id)
  }

  scope :read_by, ->(user) {
    where(user: user).where.not(read_at: nil)
  }

  class << self
    def upsert_for(message)
      if (attributes = build_upsert_attributes_for(message)).present?
        upsert_all(attributes, unique_by: %i(message_id user_id))
      end
    end

    def read_all_for_room(user, room, read_at = Time.now)
      if (attributes = build_read_all_attributes_for(user, room, read_at)).present?
        upsert_all(attributes, unique_by: %i(message_id user_id))
      end
    end

    private

    def build_upsert_attributes_for(message)
      users = User.to_upsert_message_reads_for(message)
      users.map do |user|
        {
          message_id: message.id,
          user_id:    user.id,
        }
      end
    end

    def build_read_all_attributes_for(user, room, read_at)
      messages = Message.unread_in_room_for(user, room)
      messages.map do |message|
        {
          message_id: message.id,
          user_id:    user.id,
          read_at:    read_at,
        }
      end
    end
  end
end
