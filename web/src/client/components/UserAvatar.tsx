import * as React from "react"

import { store } from "./../store"
import { User } from "./../types"
import Avatar from "./Avatar"

interface Props {
  user?: User | null
  size: number
  showState: boolean
}

const UserAvatar: React.FC<Props> = ({ user, size, showState }) => {
  const { state } = React.useContext(store)
  const { userStates } = state

  return (
    <Avatar
      url={user ? user.avatar.url : null}
      size={size}
      state={
        user && showState ? (userStates[user.handle] ? userStates[user.handle] : user.state) : null
      }
    />
  )
}

export default UserAvatar
