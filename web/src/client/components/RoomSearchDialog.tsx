import * as React from "react"
import classnames from "classnames"
import { Link, useHistory } from "react-router-dom"

import Dialog, { DialogHeader, DialogBody, DialogFooter } from "./Dialog"
import HeroMessage from "./HeroMessage"
import KeyboardTextField, { KeyboardTextFieldLegend } from "./KeyboardTextField"
import RoomLabel from "./RoomLabel"
import { Room } from "./../types"

// @ts-ignore
import styles from "./../styles/room-search-dialog.module"

import { store } from "./../store"
import { searchRooms, fetchPopularRooms } from "./../actions"
import { buildRoomLocationPathFromRoom } from "./../helpers/rooms"

interface Props {
  isVisible: boolean
  onNavigate: () => void
}

const RoomLink: React.FC<{ room: Room; onClick: () => void; isSelected: boolean }> = ({
  onClick,
  room,
  isSelected,
}) => (
  <Link
    to={buildRoomLocationPathFromRoom(room)}
    onClick={onClick}
    className={classnames(styles.link, { [styles.selected]: isSelected })}>
    <span>
      <RoomLabel room={room} />
    </span>
    <span>{room.description}</span>
  </Link>
)

const RoomSearchEmpty: React.FC = () => (
  <HeroMessage title="There are no results." description="Keep searching!" />
)

const RoomSearchDialog: React.FC<Props> = ({ isVisible, onNavigate }) => {
  const { state, dispatch } = React.useContext(store)
  const [query, setQuery] = React.useState<string>("")
  const [selectedRoomIndex, setSelectedRoomIndex] = React.useState<number>(0)
  const history = useHistory()

  const trimmedQuery = query.trim()
  const isPopularVisible = trimmedQuery.length === 0
  const rooms = isPopularVisible ? state.popularRooms : state.searchedRooms
  const roomsToDisplay = rooms.slice(0, 5)
  const onChange = (event) => setQuery(event.target.value)
  const onSelect = () => {
    onNavigate()
    history.push(buildRoomLocationPathFromRoom(roomsToDisplay[selectedRoomIndex]))
  }
  React.useEffect(() => {
    isVisible && dispatch(fetchPopularRooms())
  }, [isVisible])

  React.useEffect(() => dispatch(searchRooms(trimmedQuery)), [trimmedQuery])
  React.useEffect(() => setSelectedRoomIndex(0), [roomsToDisplay.length])

  return (
    <Dialog>
      <DialogHeader>
        <KeyboardTextField
          onUp={() =>
            setSelectedRoomIndex(
              selectedRoomIndex === 0 ? roomsToDisplay.length - 1 : selectedRoomIndex - 1
            )
          }
          onDown={() =>
            setSelectedRoomIndex(
              selectedRoomIndex + 1 >= roomsToDisplay.length ? 0 : selectedRoomIndex + 1
            )
          }
          onSelect={onSelect}
          type="search"
          placeholder="Where to?"
          defaultValue={query}
          onChange={onChange}
          isActive={isVisible}
        />
      </DialogHeader>
      {roomsToDisplay.length > 0 ? (
        <>
          <DialogBody>
            {isPopularVisible && <h5 className={styles["popular-header"]}>Popular right now</h5>}
            {roomsToDisplay.map((room, index) => (
              <RoomLink
                key={room.id}
                isSelected={selectedRoomIndex === index}
                room={room}
                onClick={() => {
                  setSelectedRoomIndex(index)
                  onNavigate()
                }}
              />
            ))}
          </DialogBody>
          <DialogFooter>
            <KeyboardTextFieldLegend className={styles.legend} />
          </DialogFooter>
        </>
      ) : (
        <DialogBody>
          <RoomSearchEmpty />
        </DialogBody>
      )}
    </Dialog>
  )
}

export default RoomSearchDialog
