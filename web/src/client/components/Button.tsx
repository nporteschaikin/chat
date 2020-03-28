import * as React from "react"

// @ts-ignore
import styles from "./../styles/button.module"

interface Props {
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

const Button: React.FC<Props> = (props) => <button className={styles.root} {...props} />

export default Button
