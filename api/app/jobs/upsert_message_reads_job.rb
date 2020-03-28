class UpsertMessageReadsJob < ApplicationJob
  def perform(id)
    MessageRead.upsert_for(Message.find(id))
  end
end
