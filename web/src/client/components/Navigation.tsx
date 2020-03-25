import * as React from "react"
import classnames from "classnames"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdCloseCircleOutline } from "react-icons/io"

import { store } from "./../store"
import { closeRoom } from "./../actions"
import { Room } from "./../types"
import UserAvatar from "./UserAvatar"
import RoomSearchModal, { RoomSearchModalManager } from "./RoomSearchModal"

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
  const { dispatch } = React.useContext(store)
  const location = useLocation()
  const path = `/r/${props.room.handle}`
  const isCurrent = path === location.pathname

  const onClickClose = (event) => {
    event.stopPropagation()
    dispatch(closeRoom(props.room.handle))
  }

  return (
    <div className={styles["room-link"]}>
      {props.showCloseButton && !isCurrent && <IoMdCloseCircleOutline onClick={onClickClose} />}
      <Link className={classnames({ [styles.current]: isCurrent })} to={path}>
        #{props.room.handle}
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
  const { rooms } = state

  return (
    <div className={styles.root}>
      <NavigationSearchButton />
      <div className={styles.links}>
        {rooms !== null && (
          <>
            <NavigationRoomSection
              rooms={rooms.filter((room) => room.open && !room.starred)}
              showCloseButton={true}
            />
            <NavigationRoomSection
              title="Starred"
              rooms={rooms.filter((room) => room.starred)}
              showCloseButton={false}
            />
          </>
        )}
      </div>
      <NavigationUser />
    </div>
  )
}

export default Navigation
