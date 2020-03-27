import * as React from "react"
import { FaMapPin } from "react-icons/fa"

import { Room } from "./../types"

// @ts-ignore
import styles from "./../styles/room-label.module"

interface Props {
  room: Room
}

const RoomLabel: React.SFC<Props> = ({ room }) => (
  <span className={styles.root}>
    {room.location !== null ? <FaMapPin /> : "#"} {room.handle}
  </span>
)

export default RoomLabel
