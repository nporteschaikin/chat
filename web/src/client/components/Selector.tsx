import * as React from "react"

// @ts-ignore
import styles from "./../styles/selector.module"

export interface Props {
  type?: string
  value?: string
  onChange: (event) => void
}

// @ts-ignore
const Selector: React.FC<Props> = React.forwardRef((props: Props, ref) => (
  // @ts-ignore
  <select ref={ref} className={styles.root} {...props} />
))

export default Selector
