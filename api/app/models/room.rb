class Room < ApplicationRecord
  GENERAL_HANDLE      = "general".freeze
  GENERAL_DESCRIPTION = "The general stuff.".freeze
  RANDOM_HANDLE       = "random".freeze
  RANDOM_DESCRIPTION  = "For random stuff.".freeze

  belongs_to :created_by, class_name: "User", optional: true
  belongs_to :location, optional: true
  has_many :room_members, class_name: "RoomMember"
  has_many :members, through: :room_members, source: :user
  has_many :messages
  has_many :stars, class_name: "RoomStar", source: :room
  has_many :room_opens
  has_many :open_by_users, through: :room_opens, source: :user
  has_many :reads, through: :messages

  pg_search_scope :search, against: %i(handle description)

  scope :visible_to, ->(user) {
    left_outer_joins(:members).
      where(location: nil, private: false).
      or(
        left_outer_joins(:members).
          where(location: user.location, private: false),
      ).
      or(
        left_outer_joins(:members).
          where(location: user.location, room_members: { user_id: user.id }).
          where.not(private: true)
      )
  }

  scope :find_by_handle_and_location_handle!, -> (room_handle, location_handle) {
    left_outer_joins(:location).
      find_by!(handle: room_handle, locations: { handle: location_handle })
  }

  scope :for_manifest, ->(manifest) {
    distinct.
      left_outer_joins(:stars).
      left_outer_joins(:room_opens).
      where(room_stars: { user_id: manifest.user.id }).
      or(
        distinct.
          left_outer_joins(:stars).
          left_outer_joins(:room_opens).
          where(room_opens: { user_id: manifest.user.id })
      ).
      order(:handle)
  }

  scope :find_last_open_for!, ->(user) {
    joins(:room_opens).
      where(room_opens: { user_id: user.id }).
      order("room_opens.updated_at desc").
      first!
  }

  scope :order_by_popularity, -> (time_range) {
    joins(:messages).
      where(messages: { created_at: time_range }).
      group("rooms.id").
      order("count(distinct(messages.id)) desc")
  }

  after_create do
    if created_by.present?
      RoomStar.find_or_create_by!(user: created_by, room: self)
    end
  end

  class << self
    def create_initial!
      [
        create!(handle: GENERAL_HANDLE, description: GENERAL_DESCRIPTION),
        create!(handle: RANDOM_HANDLE, description: RANDOM_DESCRIPTION),
      ]
    end

    def find_general!
      find_by!(handle: GENERAL_HANDLE)
    end

    def find_random!
      find_by!(handle: RANDOM_HANDLE)
    end
  end

  def formatted_handle
    "#%s" % handle
  end

  def starred_by?(user)
    stars.where(user: user).any?
  end

  def open_for?(user)
    room_opens.where(user: user).any?
  end

  def open!(user)
    room_opens.find_or_create_by!(user: user).tap(&:touch)
  end

  def close!(user)
    room_opens.find_by!(user: user).destroy
  end

  def star!(user)
    stars.find_or_create_by!(user: user)
  end

  def unstar!(user)
    stars.find_by!(user: user).destroy
  end

  def enqueue_read_all(user, read_at = Time.now)
    ReadAllRoomMessagesJob.perform_later(user.id, id, read_at)
  end

  def read_all(user, read_at = Time.now)
    MessageRead.read_all_for_room(user, self, read_at)
  end

  def read_by?(user)
    reads.by(user).read.count == reads.by(user).count
  end
end
