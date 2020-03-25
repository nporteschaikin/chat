import * as React from "react"

import { FaArrowUp, FaArrowDown } from "react-icons/fa"

// @ts-ignore
import styles from "./../styles/keyboard-icon.module"

export enum KeyboardIconType {
  Tab,
  UpArrow,
  DownArrow,
  Esc,
}

const KeyboardIcon: React.SFC<{ type: KeyboardIconType | string }> = ({ type }) => (
  <span className={styles.root}>
    {(() => {
      switch (type) {
        case KeyboardIconType.Tab: {
          return <>Tab</>
        }
        case KeyboardIconType.UpArrow: {
          return <FaArrowUp />
        }
        case KeyboardIconType.DownArrow: {
          return <FaArrowDown />
        }
        case KeyboardIconType.Esc: {
          return <>Esc</>
        }
        default: {
          return type
        }
      }
    })()}
  </span>
)

export default KeyboardIcon
