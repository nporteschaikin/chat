class RoomSerializer < ApplicationSerializer
  fields *%i[
    description
    formatted_handle
    handle
    id
  ]

  field :starred do |room, options|
    (user = options[:user]).present? &&
      room.starred_by?(user)
  end

  field :open do |room, options|
    (user = options[:user]).present? &&
      room.open_for?(user)
  end
end
