import * as React from "react"
import { Link } from "react-router-dom"

import { store } from "./../store"
import { register } from "./../actions"
import AuthForm from "./AuthForm"
import FormControl from "./FormControl"
import TextField from "./TextField"

const Register = () => {
  const { dispatch } = React.useContext(store)
  const [handle, setHandle] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const onSubmit = () => {
    const registration = {
      handle: handle.trim(),
      displayName: displayName.trim(),
      email: email.trim(),
      password,
    }

    if (Object.values(registration).every((value) => value.length > 0)) {
      dispatch(register(registration))
    }
  }

  return (
    <AuthForm
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
    </AuthForm>
  )
}

export default Register
