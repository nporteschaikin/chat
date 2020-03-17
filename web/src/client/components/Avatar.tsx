import * as React from "react"
import classnames from "classnames"

import { UserState } from "./../types"

// @ts-ignore
import styles from "./../styles/avatar.module"

interface Props {
  url: string | null
  size: number
  state?: UserState | null
  tooltip?: string
  style?: any
}

const Avatar: React.FC<Props> = ({ url, size, state, style }) => (
  <div style={{ ...style, width: `${size}px` }} className={styles.root}>
    {url !== null && <img src={url} />}
    {state && <div className={classnames(styles.state, styles[state])} />}
  </div>
)

export default Avatar
