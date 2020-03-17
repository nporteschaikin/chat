import * as React from "react"

import Alert, { AlertStyle } from "./Alert"
import AuthRedirect from "./AuthRedirect"
import Button from "./Button"
import { store } from "./../store"

// @ts-ignore
import styles from "./../styles/auth-form.module"

interface Props {
  error?: string | null
  renderHeader: () => JSX.Element
  renderFooter: () => JSX.Element
  submitText: string
  onSubmit: () => void
}

const AuthForm: React.FC<Props> = (props) => {
  const { state } = React.useContext(store)

  if (state.isAuthenticated) {
    return <AuthRedirect />
  }

  return (
    <div className={styles.root}>
      <div className={styles.box}>
        <header>{props.renderHeader()}</header>
        {props.error && <Alert style={AlertStyle.Error}>{props.error}</Alert>}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            props.onSubmit()
          }}>
          {props.children}
          <Button type="submit">{props.submitText}</Button>
        </form>
        <footer>{props.renderFooter()}</footer>
      </div>
    </div>
  )
}

export default AuthForm
