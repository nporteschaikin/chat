import * as React from "react"
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom"

import { store, Provider } from "./../store"
import { boot } from "./../actions"
import AuthRedirect from "./AuthRedirect"
import Login from "./Login"
import Register from "./Register"
import AuthRoute from "./AuthRoute"
import Room from "./Room"
import ProfileSettings from "./ProfileSettings"
import { LoadingScreen } from "./Loader"

const Router = () => {
  const { state, dispatch } = React.useContext(store)

  // Boot the app - checks auth etc.
  React.useEffect(() => dispatch(boot()), [])

  return (
    <BrowserRouter>
      {state.isReady ? (
        <Switch>
          <Route exact path="/">
            {!state.isAuthenticated ? <Redirect to="/in" /> : <AuthRedirect />}
          </Route>
          <Route path="/in" children={<Login />} />
          <Route path="/up" children={<Register />} />
          <AuthRoute path="/r/:locationHandle?/:handle?" component={Room} />
          <AuthRoute path="/settings/profile" component={ProfileSettings} />
          <Redirect from="/settings" to="/settings/profile" />
        </Switch>
      ) : (
        <LoadingScreen />
      )}
    </BrowserRouter>
  )
}

const App = () => (
  <Provider>
    <Router />
  </Provider>
)

export default App
