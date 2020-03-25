import * as React from "react"

import TextField, { Props as TextFieldProps } from "./TextField"
import KeyboardIcon, { KeyboardIconType } from "./KeyboardIcon"

// @ts-ignore
import styles from "./../styles/keyboard-text-field.module"

interface Props extends TextFieldProps {
  onUp: () => void
  onDown: () => void
  onSelect: () => void
  isActive: boolean
}

export const KeyboardTextFieldLegend: React.SFC = () => (
  <div className={styles.legend}>
    <div>
      <KeyboardIcon type={KeyboardIconType.Tab} />
      <KeyboardIcon type={KeyboardIconType.UpArrow} />
      <KeyboardIcon type={KeyboardIconType.DownArrow} />
    </div>
    <div>to navigate</div>
    <div className={styles["legend-dismiss"]}>
      <div>
        <KeyboardIcon type={KeyboardIconType.Esc} />
      </div>
      <div>to dismiss</div>
    </div>
  </div>
)

const KeyboardTextField: React.SFC<Props> = ({ onUp, onDown, onSelect, isActive, ...rest }) => {
  const ref = React.useRef<HTMLInputElement>()
  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case 38: {
        event.preventDefault()
        onUp()
        break
      }
      case 9:
      case 40: {
        event.preventDefault()
        onDown()
        break
      }
      case 13: {
        event.preventDefault()
        onSelect()
        return
      }
    }
  }

  React.useEffect(() => {
    if (isActive) {
      ref.current!.focus()
    }
  }, [isActive])

  React.useEffect(() => {
    ref.current!.addEventListener("keydown", onKeyDown)

    return () => {
      ref.current!.removeEventListener("keydown", onKeyDown)
    }
  })

  return <TextField {...rest} ref={ref} />
}

export default KeyboardTextField
