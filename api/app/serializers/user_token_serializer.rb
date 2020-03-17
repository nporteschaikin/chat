class UserTokenSerializer < ApplicationSerializer
  fields *%i[token]

  association :user, blueprint: UserSerializer
end
