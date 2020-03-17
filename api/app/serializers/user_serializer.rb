class UserSerializer < ApplicationSerializer
  identifier :id

  fields *%i[
    formatted_handle
    display_name
    handle
    state
  ]

  association :avatar, blueprint: AvatarSerializer
end
