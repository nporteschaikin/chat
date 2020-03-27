class RoomSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers

  fields *%i(
    description
    formatted_handle
    handle
    id
  )

  field :starred do |room, options|
    (user = options[:user]).present? &&
      room.starred_by?(user)
  end

  field :open do |room, options|
    (user = options[:user]).present? &&
      room.open_for?(user)
  end

  association :location, blueprint: LocationSerializer

  field :api_url do |room|
    helpers = Rails.application.routes.url_helpers

    if (location = room.location).present?
      helpers.location_room_open_url(
        location.handle,
        handle,
      )
    else
      helpers.room_open_url(room.handle)
    end
  end
end
