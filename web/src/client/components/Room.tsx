import * as React from "react"
import { useParams } from "react-router-dom"

import Dashboard from "./Dashboard"
import RoomHeader from "./RoomHeader"
import RoomMessages from "./RoomMessages"
import RoomEditor from "./RoomEditor"
import { store } from "./../store"
import { openRoomByPath } from "./../actions"
import { Room as RoomType, RoomPath } from "./../types"
import { isPathForRoom } from "./../helpers/rooms"
import { LoadingScreen } from "./Loader"

// @ts-ignore
import styles from "./../styles/room.module"

const Room: React.FC = () => {
  const { locationHandle, handle } = useParams()
  const { state, dispatch } = React.useContext(store)
  const { rooms } = state

  const path: RoomPath = {
    handle: handle ? handle : locationHandle!,
    locationHandle: handle ? locationHandle : undefined,
  }
  const room: RoomType | undefined = rooms.find((room) => isPathForRoom(path, room))

  React.useEffect(() => dispatch(openRoomByPath(path)), [locationHandle!, handle!])

  return (
    <Dashboard>
      {!room ? (
        <LoadingScreen />
      ) : (
        <div className={styles.root}>
          <RoomHeader room={room} />
          <RoomMessages room={room} />
          <RoomEditor room={room} />
        </div>
      )}
    </Dashboard>
  )
}

export default Room
