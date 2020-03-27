class MessageSerializer < ApplicationSerializer
  identifier :id

  fields *%i(body)
  time_fields *%i(created_at)

  association :author, blueprint: UserSerializer
end
