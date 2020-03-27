class ManifestSerializer < ApplicationSerializer
  association :user, blueprint: UserSerializer

  association :rooms, blueprint: RoomSerializer do |manifest|
    user = manifest.user
    user.visible_rooms.for_manifest(manifest)
  end

  association :last_open_room, blueprint: RoomSerializer do |manifest|
    user = manifest.user
    user.visible_rooms.find_last_open_for!(manifest.user)
  end
end
