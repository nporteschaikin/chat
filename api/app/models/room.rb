class Room < ApplicationRecord
  GENERAL_HANDLE      = "general".freeze
  GENERAL_DESCRIPTION = "The general stuff.".freeze
  RANDOM_HANDLE       = "random".freeze
  RANDOM_DESCRIPTION  = "For random stuff.".freeze

  belongs_to :created_by, class_name: "User", optional: true
  has_many :messages
  has_many :stars, class_name: "RoomStar", source: :room
  has_many :open_rooms

  pg_search_scope :search, against: %i(handle description)

  scope :for_manifest, ->(manifest) {
    distinct.
      left_outer_joins(:stars).
      left_outer_joins(:open_rooms).
      where(room_stars: { user_id: manifest.user.id }).
      or(
        distinct.
          left_outer_joins(:stars).
          left_outer_joins(:open_rooms).
          where(open_rooms: { user_id: manifest.user.id })
      ).
      order(:handle)
  }

  scope :find_last_open_for!, ->(user) {
    joins(:open_rooms).
      where(open_rooms: { user_id: user.id }).
      order("open_rooms.updated_at desc").
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
    open_rooms.where(user: user).any?
  end

  def open_for!(user)
    open_rooms.find_or_create_by!(user: user).touch
  end

  def close_for!(user)
    open_rooms.where(user: user).delete_all
  end

  def toggle_star_for!(user)
    if stars.where(user: user).delete_all == 0
      stars.create!(user: user)
    end
  end
end
