class ManifestSerializer < ApplicationSerializer
  association :user, blueprint: UserSerializer

  association :rooms, blueprint: RoomSerializer do |manifest|
    Room.for_manifest(manifest)
  end

  association :last_open_room, blueprint: RoomSerializer do |manifest|
    Room.find_last_open_for!(manifest.user)
  end
end
