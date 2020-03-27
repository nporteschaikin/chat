import * as React from "react"
import { Link } from "react-router-dom"

import { store } from "./../store"
import { logIn } from "./../actions"
import AuthForm from "./AuthForm"
import FormControl from "./FormControl"
import TextField from "./TextField"

const Login = () => {
  const { state, dispatch } = React.useContext(store)
  const { login } = state
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const trimmedEmail = email.trim()
  const isComplete = trimmedEmail.length > 0 && password.length > 0

  const onSubmit = () => dispatch(logIn(trimmedEmail, password))

  return (
    <AuthForm
      isLoading={false}
      isComplete={isComplete}
      submitText="Sign in"
      onSubmit={onSubmit}
      renderHeader={() => <>👋</>}
      renderFooter={() => (
        <>
          Not a member? <Link to="/up">Register now</Link>.
        </>
      )}
      error={login.isInvalid && "Invalid e-mail address or password."}>
      <FormControl label="E-mail address">
        <TextField
          type="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <FormControl label="Password">
        <TextField
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormControl>
    </AuthForm>
  )
}

export default Login
