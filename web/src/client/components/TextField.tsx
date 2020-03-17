import * as React from "react"

// @ts-ignore
import styles from "./../styles/text-field.module"

interface Props {
  type?: string
  defaultValue?: string
  placeholder?: string
  onChange: (event) => void
}

// @ts-ignore
const TextField = React.forwardRef((props: Props, ref) => (
  // @ts-ignore
  <input ref={ref} className={styles.root} {...props} />
))

export default TextField
