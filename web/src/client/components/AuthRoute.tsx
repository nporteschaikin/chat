import * as React from "react"
import { Route, Redirect } from "react-router-dom"

import { store } from "./../store"

const AuthRoute = ({ component, ...rest }) => {
  const { state } = React.useContext(store)
  const RenderComponent = component

  return (
    <Route
      {...rest}
      render={(props) =>
        state.isAuthenticated ? <RenderComponent {...props} /> : <Redirect to="/in" />
      }
    />
  )
}

export default AuthRoute
