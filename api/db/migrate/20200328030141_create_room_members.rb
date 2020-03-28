class CreateRoomMembers < ActiveRecord::Migration[6.0]
  def change
    create_table :room_members do |t|
      t.references :user, foreign_key: { on_delete: :cascade }, null: false
      t.references :room, foreign_key: { on_delete: :cascade }, null: false

      t.timestamps
    end

    change_table :rooms do |t|
      t.boolean :private, default: false, null: false
    end
  end
end
