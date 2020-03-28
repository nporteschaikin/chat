class MessageSerializer < ApplicationSerializer
  identifier :id

  fields *%i(body)
  time_fields *%i(created_at)

  association :author, blueprint: UserSerializer

  field :read do |message, options|
    (user = options[:user]).present? &&
      message.read_by?(user)
  end
end
