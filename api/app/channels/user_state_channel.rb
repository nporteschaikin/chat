class UserStateChannel < ApplicationCable::Channel
  ChangedEvent = Class.new(Event)

  def subscribed
    user = User.find(params.fetch(:id))
    stream_for(user)

    if user == current_user && !current_user.away?
      current_user.online!
    end
  end

  def unsubscribed
    user = User.find(params.fetch(:id))

    if user == current_user && !current_user.away?
      current_user.offline!
    end
  end
end
