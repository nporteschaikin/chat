import * as React from "react"

interface Props {
  title: string
  description?: string
}

// @ts-ignore
import styles from "./../styles/hero-message.module"

// @ts-ignore
const HeroMessage: React.FC<Props> = (props) => (
  <div className={styles.root}>
    <h2>{props.title}</h2>
    {props.description && <h4>{props.description}</h4>}
  </div>
)

export default HeroMessage
