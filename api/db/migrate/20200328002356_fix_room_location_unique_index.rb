class FixRoomLocationUniqueIndex < ActiveRecord::Migration[6.0]
  def change
    change_table :rooms do |t|
      t.remove_index [:location_id, :handle]
      t.index [:location_id, :handle], unique: true, where: %q(location_id is not null)
      t.index [:handle], unique: true, where: %q(location_id is null)
    end
  end
end
