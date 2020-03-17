import * as React from "react"

// @ts-ignore
import styles from "./../styles/form-control.module"

const FormControl: React.FC<{ label: string }> = (props) => (
  <div className={styles.root}>
    {!!props.label && <label>{props.label}</label>}
    {props.children}
  </div>
)

export default FormControl
