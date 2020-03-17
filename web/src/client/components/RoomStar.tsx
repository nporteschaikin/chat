import * as React from "react"
import classnames from "classnames"
import { AiFillStar } from "react-icons/ai"

import { store } from "./../store"
import { toggleRoomStar } from "./../actions"
import { Room } from "./../types"

// @ts-ignore
import styles from "./../styles/room-star.module"

const RoomStar: React.FC<{ room: Room }> = ({ room }) => {
  const { dispatch } = React.useContext(store)

  const toggleStar = () => dispatch(toggleRoomStar(room.handle))

  return (
    <AiFillStar
      onClick={toggleStar}
      className={classnames(styles.root, { [styles.starred]: room.starred })}
    />
  )
}

export default RoomStar
