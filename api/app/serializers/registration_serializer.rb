class RegistrationSerializer < ApplicationSerializer
  association :user_token, blueprint: UserTokenSerializer
end
