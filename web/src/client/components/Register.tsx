import * as React from "react"
import { Link } from "react-router-dom"

import { store } from "./../store"
import { register, fetchLocations } from "./../actions"
import AuthForm from "./AuthForm"
import FormControl from "./FormControl"
import TextField from "./TextField"
import Selector from "./Selector"

const Register = () => {
  const { state, dispatch } = React.useContext(store)
  const [handle, setHandle] = React.useState<string>("")
  const [displayName, setDisplayName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [locationId, setLocationId] = React.useState<string>("")

  const registration = {
    handle: handle.trim(),
    displayName: displayName.trim(),
    email: email.trim(),
    password,
    locationId,
  }
  console.log(registration)

  const isComplete = Object.values(registration).every((value) => value.length > 0)

  const onSubmit = () => {
    if (Object.values(registration).every((value) => value.length > 0)) {
      dispatch(register(registration))
    }
  }

  React.useEffect(() => {
    if (state.locations === null) {
      dispatch(fetchLocations())
    } else {
      setLocationId(state.locations[0]!.id.toString())
    }
  }, [state.locations])

  return (
    <AuthForm
      isLoading={state.locations === null}
      isComplete={isComplete}
      submitText="Sign up"
      onSubmit={onSubmit}
      renderHeader={() => <>🙌</>}
      renderFooter={() => (
        <>
          Already a member? <Link to="/in">Sign in</Link>.
        </>
      )}>
      <FormControl label="Handle">
        <TextField
          type="text"
          placeholder="Handle"
          defaultValue={handle}
          onChange={(event) => setHandle(event.target.value)}
        />
      </FormControl>
      <FormControl label="Display name">
        <TextField
          type="text"
          placeholder="Display name"
          defaultValue={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </FormControl>
      <FormControl label="E-mail address">
        <TextField
          type="email"
          placeholder="Email"
          defaultValue={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <FormControl label="Password">
        <TextField
          type="password"
          placeholder="Password"
          defaultValue={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormControl>
      <FormControl label="Where are you?">
        <Selector onChange={(event) => setLocationId(event.target.value)} value={locationId}>
          {(state.locations || []).map((location) => (
            <option key={location.id} value={location.id}>
              {location.humanName}
            </option>
          ))}
        </Selector>
      </FormControl>
    </AuthForm>
  )
}

export default Register
