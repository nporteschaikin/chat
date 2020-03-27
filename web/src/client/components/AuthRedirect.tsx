import * as React from "react"
import { Redirect } from "react-router-dom"

import { store } from "./../store"
import { buildRoomLocationPathFromRoom } from "./../helpers/rooms"

const AuthRedirect: React.FC = () => {
  const { state } = React.useContext(store)
  const { lastOpenRoom } = state
  const firstStarredRoom = state.rooms.find((room) => room.starred) || null

  return <Redirect to={buildRoomLocationPathFromRoom(lastOpenRoom || firstStarredRoom)} />
}

export default AuthRedirect
