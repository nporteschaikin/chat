import * as React from "react"
import classnames from "classnames"
import { Link, useHistory } from "react-router-dom"

import { store } from "./../store"
import { searchRooms, fetchPopularRooms } from "./../actions"
import { Room } from "./../types"
import Modal, { ModalManager } from "./Modal"
import Dialog, { DialogHeader, DialogBody } from "./Dialog"
import TextField from "./TextField"
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
    <span>{room.formattedHandle}</span>
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
  const ref = React.useRef<HTMLInputElement>()

  const trimmedQuery = query.trim()
  const isPopularVisible = trimmedQuery.length === 0
  const rooms = isPopularVisible ? state.popularRooms : state.searchedRooms
  const onChange = (event) => setQuery(event.target.value)

  const onKeyDown = (event) => {
    event.stopPropagation()

    switch (event.keyCode) {
      case 38: {
        event.preventDefault()
        setSelectedRoomIndex(selectedRoomIndex - 1)
        return
      }
      case 9:
      case 40: {
        event.preventDefault()
        setSelectedRoomIndex(selectedRoomIndex + 1 >= rooms.length ? 0 : selectedRoomIndex + 1)
        return
      }
      case 13: {
        event.preventDefault()
        onNavigate()
        history.push(`/r/${rooms[selectedRoomIndex].handle}`)
        return
      }
    }
  }

  React.useEffect(() => {
    isVisible && ref.current!.focus()
  }, [isVisible])
  React.useEffect(() => {
    isVisible && dispatch(fetchPopularRooms())
  }, [isVisible])
  React.useEffect(() => dispatch(searchRooms(trimmedQuery)), [trimmedQuery])
  React.useEffect(() => setSelectedRoomIndex(0), [rooms.length])
  React.useEffect(() => {
    ref.current!.addEventListener("keydown", onKeyDown)

    return () => {
      ref.current!.removeEventListener("keydown", onKeyDown)
    }
  }, [selectedRoomIndex, rooms.length])

  return (
    <Modal isVisible={isVisible} onClick={onClick}>
      <Dialog>
        <DialogHeader>
          <TextField
            ref={ref}
            type="search"
            placeholder="Where to?"
            defaultValue={query}
            onChange={onChange}
          />
        </DialogHeader>
        {rooms.length > 0 ? (
          <DialogBody>
            {isPopularVisible && <h5 className={styles["popular-header"]}>Popular right now</h5>}
            {rooms.slice(0, 5).map((room, index) => (
              <RoomLink
                key={room.handle}
                isSelected={selectedRoomIndex === index}
                room={room}
                onClick={() => {
                  setSelectedRoomIndex(index)
                  onNavigate()
                }}
              />
            ))}
          </DialogBody>
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
