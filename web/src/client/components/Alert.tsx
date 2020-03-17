import * as React from "react"
import classnames from "classnames"

// @ts-ignore
import styles from "./../styles/alert.module"

export enum AlertStyle {
  Error = "error",
}

const Alert: React.SFC<{ style: AlertStyle }> = (props) => (
  <div className={classnames(styles.root, styles[props.style])}>{props.children}</div>
)

export default Alert
