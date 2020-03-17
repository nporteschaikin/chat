class CreateInitialTables < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :handle, index: { unique: true }, null: false
      t.string :display_name, null: false
      t.string :email, index: { unique: true }, null: false
      t.string :password_digest, null: false

      t.string :state, null: false
      t.timestamp :last_online_at, null: true
      t.timestamp :last_offline_at, null: true
      t.timestamp :last_away_at, null: true

      t.timestamps
    end

    create_table :rooms do |t|
      t.string :handle, index: { unique: true }, null: false
      t.string :description, null: false
      t.references :created_by, foreign_key: { to_table: :users, on_delete: :nullify }, null: true

      t.timestamps
    end

    create_table :messages do |t|
      t.references :room, foreign_key: { on_delete: :cascade }, null: false
      t.references :author, foreign_key: { to_table: :users, on_delete: :nullify }, null: true
      t.string :body, null: false

      t.timestamps
    end

    create_table :room_stars do |t|
      t.references :room, foreign_key: { on_delete: :cascade }, null: false
      t.references :user, foreign_key: { on_delete: :cascade }, null: false

      t.timestamps

      t.index [:user_id, :room_id], unique: true
    end

    create_table :open_rooms do |t|
      t.references :room, foreign_key: { on_delete: :cascade }, null: false
      t.references :user, foreign_key: { on_delete: :cascade }, null: false

      t.timestamps

      t.index [:user_id, :room_id], unique: true
    end
  end
end
