import * as React from "react"

// @ts-ignore
import styles from "./../styles/icon-button.module"

interface Props {
  icon: any // TODO: specify type
  onClick?: (event) => void
}

const IconButton: React.FC<Props> = (props) => {
  const Icon = props.icon

  return (
    <button onClick={props.onClick} className={styles.root}>
      <Icon />
    </button>
  )
}

export default IconButton
