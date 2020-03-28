class CreateMessageReads < ActiveRecord::Migration[6.0]
  def change
    create_table :message_reads do |t|
      t.references :message, foreign_key: { on_delete: :cascade }, null: false
      t.references :user, foreign_key: { on_delete: :cascade }, null: false
      t.timestamp :read_at, null: true

      t.index [:message_id, :user_id], unique: true
    end
  end
end
