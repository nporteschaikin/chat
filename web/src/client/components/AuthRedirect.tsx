import * as React from "react"
import { Redirect } from "react-router-dom"

import { store } from "./../store"

const AuthRedirect: React.FC = () => {
  const { state } = React.useContext(store)

  return <Redirect to={`/r/${state.lastOpenRoom.handle}`} />
}

export default AuthRedirect
