import * as React from "react"

import { Room } from "./../types"
import RoomStar from "./RoomStar"
import RoomLabel from "./RoomLabel"

// @ts-ignore
import styles from "./../styles/room.module"

interface Props {
  room: Room
}

const RoomHeader: React.FC<Props> = ({ room }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.handle}>
        <RoomLabel room={room} />
        <div className={styles.star}>
          <RoomStar room={room} />
        </div>
      </h1>
      <h4 className={styles.description}>{room.description}</h4>
    </div>
  )
}

export default RoomHeader
