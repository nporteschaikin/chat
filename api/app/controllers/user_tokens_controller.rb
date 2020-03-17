class UserTokensController < ApplicationController
  def create
    token = UserToken.create!(user_token_params)
    render json: UserTokenSerializer.render(token)
  end

  private

  def user_token_params
    params.require(:user_token).permit(
      :email,
      :password,
    )
  end
end
