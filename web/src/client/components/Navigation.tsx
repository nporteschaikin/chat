import * as React from "react"
import classnames from "classnames"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdCloseCircleOutline } from "react-icons/io"

import RoomSearchModal, { RoomSearchModalManager } from "./RoomSearchModal"
import UserAvatar from "./UserAvatar"
import RoomLabel from "./RoomLabel"
import { Room } from "./../types"
import { buildRoomLocationPathFromRoom } from "./../helpers/rooms"
import { closeRoom } from "./../actions"
import { store } from "./../store"

// @ts-ignore
import styles from "./../styles/navigation.module"

const NavigationUser: React.FC = () => {
  const { state } = React.useContext(store)
  const { authenticatedUser } = state

  return (
    <div className={styles.user}>
      <Link to="/settings">
        <div className={styles.avatar}>
          <UserAvatar user={authenticatedUser!} size={35} showState={true} />
        </div>
        <div className={styles.names}>
          <strong>{authenticatedUser.displayName}</strong>
          <span>{authenticatedUser.formattedHandle}</span>
        </div>
      </Link>
    </div>
  )
}

const NavigationSearchButton: React.FC = () => (
  <RoomSearchModalManager>
    {(isVisible, setVisible) => (
      <div className={styles.search}>
        <button onClick={() => setVisible(!isVisible)}>
          <span>
            <AiOutlineSearch />
          </span>
          <span>Find a room</span>
        </button>
        <RoomSearchModal
          isVisible={isVisible}
          onClick={() => setVisible(false)}
          onNavigate={() => setVisible(false)}
        />
      </div>
    )}
  </RoomSearchModalManager>
)

const NavigationRoomLink: React.FC<{ room: Room; showCloseButton: boolean }> = (props) => {
  const { state, dispatch } = React.useContext(store)
  const location = useLocation()
  const path = buildRoomLocationPathFromRoom(props.room)
  const isCurrent = path === location.pathname
  const isUnread = !!state.unreadRooms[props.room.id]

  const onClickClose = () => dispatch(closeRoom(props.room))

  return (
    <div className={classnames(styles["room-link"], { [styles.current]: isCurrent })}>
      {props.showCloseButton && !isCurrent && (
        <IoMdCloseCircleOutline onClick={onClickClose} className={styles.close} />
      )}
      <Link to={path} onClick={(event) => event.stopPropagation()}>
        <RoomLabel room={props.room} />
        {isUnread && <span className={styles.unread} />}
      </Link>
    </div>
  )
}

const NavigationRoomSection: React.FC<{
  rooms: Room[]
  title?: string
  showCloseButton: boolean
}> = (props) => {
  if (props.rooms.length === 0) return null

  return (
    <div className={styles.section}>
      {!!props.title && <h4>{props.title}</h4>}
      {props.rooms.map((room) => (
        <NavigationRoomLink key={room.id} room={room} showCloseButton={props.showCloseButton} />
      ))}
    </div>
  )
}

const Navigation: React.FC = () => {
  const { state } = React.useContext(store)
  const { rooms, authenticatedUser } = state

  return (
    <div className={styles.root}>
      <NavigationSearchButton />
      <div className={styles.links}>
        {rooms !== null && (
          <>
            <NavigationRoomSection
              title="Starred"
              rooms={rooms.filter((room) => room.starred)}
              showCloseButton={false}
            />
            <NavigationRoomSection
              title={authenticatedUser.location.humanName}
              rooms={rooms.filter((room) => !room.starred && room.open && room.location !== null)}
              showCloseButton={true}
            />
            <NavigationRoomSection
              title="Global"
              rooms={rooms.filter((room) => !room.starred && room.open && room.location === null)}
              showCloseButton={true}
            />
          </>
        )}
      </div>
      <NavigationUser />
    </div>
  )
}

export default Navigation
