class CreateLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :locations do |t|
      t.string :handle, index: { unique: true }, null: false
      t.string :human_name, null: false

      t.timestamps
    end

    change_table :users do |t|
      t.references :location, foreign_key: { on_delete: :cascade }, null: true
    end

    change_table :rooms do |t|
      t.references :location, foreign_key: { on_delete: :cascade }, null: true
      t.index [:location_id, :handle], unique: true
      t.remove_index :handle
    end

    reversible do |direction|
      direction.up do
        execute <<~SQL
          insert into locations (handle, human_name, created_at, updated_at) values('nyc', 'New York City', now(), now());
          update users set location_id = (select id from locations limit 1);
        SQL
      end
    end

    change_column_null :users, :location_id, false
  end
end
