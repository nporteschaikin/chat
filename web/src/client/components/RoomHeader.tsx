import * as React from "react"

import { Room } from "./../types"
import RoomStar from "./RoomStar"

// @ts-ignore
import styles from "./../styles/room.module"

interface Props {
  room: Room
}

const RoomHeader: React.FC<Props> = ({ room }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.handle}>
        #{room.handle}
        <RoomStar room={room} />
      </h1>
      <h4 className={styles.description}>{room.description}</h4>
    </div>
  )
}

export default RoomHeader
