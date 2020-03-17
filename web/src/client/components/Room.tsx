import * as React from "react"
import { useParams } from "react-router-dom"

import Dashboard from "./Dashboard"
import RoomHeader from "./RoomHeader"
import RoomMessages from "./RoomMessages"
import RoomEditor from "./RoomEditor"
import { store } from "./../store"
import { openRoom } from "./../actions"
import { Room as RoomType } from "./../types"
import { LoadingScreen } from "./Loader"

// @ts-ignore
import styles from "./../styles/room.module"

const Room: React.FC = () => {
  const { handle } = useParams()
  const { state, dispatch } = React.useContext(store)

  React.useEffect(() => dispatch(openRoom(handle!)), [handle!])

  const room: RoomType | undefined =
    state.rooms !== null && state.rooms.find((room) => room.handle === handle)

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
