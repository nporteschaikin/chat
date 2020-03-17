import * as React from "react"
import classnames from "classnames"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"

import { store } from "./../store"
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

const NavigationRoomLink: React.FC<{ room: Room }> = (props) => {
  const location = useLocation()
  const path = `/r/${props.room.handle}`
  const isCurrent = path === location.pathname

  return (
    <div>
      <Link className={classnames({ [styles.current]: isCurrent })} to={path}>
        #{props.room.handle}
      </Link>
    </div>
  )
}

const NavigationRoomSection: React.FC<{ rooms: Room[]; title?: string; className?: string }> = (
  props
) => {
  if (props.rooms.length === 0) return null

  return (
    <div className={classnames(styles.section, props.className)}>
      {!!props.title && <h4>{props.title}</h4>}
      {props.rooms.map((room) => (
        <NavigationRoomLink key={room.id} room={room} />
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
              rooms={rooms.filter((room) => room.open)}
              className={styles.opened}
            />
            <NavigationRoomSection
              title="Starred"
              rooms={rooms.filter((room) => room.starred && !room.open)}
            />
          </>
        )}
      </div>
      <NavigationUser />
    </div>
  )
}

export default Navigation
