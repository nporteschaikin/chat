class User < ApplicationRecord
  has_secure_password

  has_many :user_tokens
  has_many :room_stars
  has_many :starred_rooms, through: :room_stars, source: :room
  has_many :authored_messages, class_name: "Message", source: :author

  belongs_to :location

  NEW     = "new".freeze
  ONLINE  = "online".freeze
  OFFLINE = "offline".freeze
  AWAY    = "away".freeze

  attribute :state, :string, default: NEW

  after_create do
    room = Room.find_general!
    room.open!(self)
  end

  after_save do
    if saved_change_to_state?
      UserStateChannel.broadcast_event_to(
        self,
        UserStateChannel::ChangedEvent,
        state,
      )
    end
  end

  def formatted_handle
    "@%s" % handle
  end

  def avatar
    Avatar.new(self)
  end

  def online!
    update!(state: ONLINE, last_online_at: Time.now)
  end

  def offline!
    update!(state: OFFLINE, last_offline_at: Time.now)
  end

  def away!
    update!(state: AWAY, last_away_at: Time.now)
  end

  def away?
    state == AWAY
  end

  def visible_rooms
    Room.visible_to(self)
  end
end
