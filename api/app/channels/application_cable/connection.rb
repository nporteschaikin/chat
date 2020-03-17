module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user =
        if (user = find_current_user)
          user
        else
          reject_unauthorized_connection
        end
    end

    private

    def find_current_user
      if (token = request.params[:token]).present?
        user_token = UserToken.decode(token)
        user_token&.user
      end
    end
  end
end
