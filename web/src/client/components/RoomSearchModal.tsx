import * as React from "react"
import classnames from "classnames"
import { Link, useHistory } from "react-router-dom"

import { store } from "./../store"
import { searchRooms, fetchPopularRooms } from "./../actions"
import { Room } from "./../types"
import RoomLabel from "./RoomLabel"
import Modal, { ModalManager } from "./Modal"
import Dialog, { DialogHeader, DialogBody, DialogFooter } from "./Dialog"
import KeyboardTextField, { KeyboardTextFieldLegend } from "./KeyboardTextField"
import HeroMessage from "./HeroMessage"

// @ts-ignore
import styles from "./../styles/room-search-modal.module"

interface Props {
  isVisible: boolean
  onClick: () => void
  onNavigate: () => void
}

export const RoomSearchModalManager = ModalManager

const RoomLink: React.FC<{ room: Room; onClick: () => void; isSelected: boolean }> = ({
  onClick,
  room,
  isSelected,
}) => (
  <Link
    to={`/r/${room.handle}`}
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

const RoomSearchModal: React.FC<Props> = ({ isVisible, onClick, onNavigate }) => {
  const { state, dispatch } = React.useContext(store)
  const [query, setQuery] = React.useState<string>("")
  const [selectedRoomIndex, setSelectedRoomIndex] = React.useState<number>(0)
  const history = useHistory()

  const trimmedQuery = query.trim()
  const isPopularVisible = trimmedQuery.length === 0
  const rooms = isPopularVisible ? state.popularRooms : state.searchedRooms
  const onChange = (event) => setQuery(event.target.value)
  const onSelect = () => {
    onNavigate()
    history.push(`/r/${rooms[selectedRoomIndex].handle}`)
  }

  React.useEffect(() => {
    isVisible && dispatch(fetchPopularRooms())
  }, [isVisible])
  React.useEffect(() => dispatch(searchRooms(trimmedQuery)), [trimmedQuery])
  React.useEffect(() => setSelectedRoomIndex(0), [rooms.length])

  return (
    <Modal isVisible={isVisible} onClick={onClick}>
      <Dialog>
        <DialogHeader>
          <KeyboardTextField
            onUp={() => setSelectedRoomIndex(selectedRoomIndex === 0 ? 0 : selectedRoomIndex - 1)}
            onDown={() =>
              setSelectedRoomIndex(
                selectedRoomIndex + 1 >= rooms.length ? 0 : selectedRoomIndex + 1
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
        {rooms.length > 0 ? (
          <>
            <DialogBody>
              {isPopularVisible && <h5 className={styles["popular-header"]}>Popular right now</h5>}
              {rooms.slice(0, 5).map((room, index) => (
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
              <KeyboardTextFieldLegend />
            </DialogFooter>
          </>
        ) : (
          <DialogBody>
            <RoomSearchEmpty />
          </DialogBody>
        )}
      </Dialog>
    </Modal>
  )
}

export default RoomSearchModal
