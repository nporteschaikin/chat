import * as React from "react"
import classnames from "classnames"
import { Link, useLocation } from "react-router-dom"

import { store } from "./../store"
import { logOut } from "./../actions"

// @ts-ignore
import styles from "./../styles/settings-navigation.module"

const SettingsLink: React.FC<{ to: string; onClick: (event) => void }> = (props) => {
  const location = useLocation()
  const isCurrent = props.to === location.pathname

  return (
    <div>
      <Link
        onClick={props.onClick}
        className={classnames({ [styles.current]: isCurrent })}
        to={props.to}>
        {props.children}
      </Link>
    </div>
  )
}

const SettingsNavigation: React.FC = () => {
  const { dispatch } = React.useContext(store)

  return (
    <div className={styles.root}>
      <div className={styles.links}>
        <SettingsLink to="/settings/profile" onClick={() => console.log("Profile")}>
          Profile
        </SettingsLink>
      </div>
      <div className={styles.logout}>
        <SettingsLink to="#" onClick={() => dispatch(logOut())}>
          Sign out
        </SettingsLink>
      </div>
    </div>
  )
}

export default SettingsNavigation
