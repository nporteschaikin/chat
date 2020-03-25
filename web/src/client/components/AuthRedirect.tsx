import * as React from "react"
import { Redirect } from "react-router-dom"

import { store } from "./../store"

const DEFAULT_ROOM_HANDLE = "general"

const AuthRedirect: React.FC = () => {
  const { state } = React.useContext(store)
  const { lastOpenRoom } = state
  const firstStarredRoom = state.rooms.find((room) => room.starred) || null

  return (
    <Redirect
      to={`/r/${
        lastOpenRoom
          ? lastOpenRoom.handle
          : firstStarredRoom
          ? firstStarredRoom.handle
          : DEFAULT_ROOM_HANDLE
      }`}
    />
  )
}

export default AuthRedirect
