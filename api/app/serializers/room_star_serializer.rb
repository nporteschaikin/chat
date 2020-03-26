class RoomStarSerializer < ApplicationSerializer
  association :room, blueprint: RoomSerializer
  association :user, blueprint: UserSerializer
end

