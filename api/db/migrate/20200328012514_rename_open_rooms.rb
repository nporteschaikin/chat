class RenameOpenRooms < ActiveRecord::Migration[6.0]
  def change
    rename_table :open_rooms, :room_opens
  end
end
