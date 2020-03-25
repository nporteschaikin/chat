import * as React from "react"

import TextField, { Props as TextFieldProps } from "./TextField"

interface Props extends TextFieldProps {
  onUp: () => void
  onDown: () => void
  onSelect: () => void
  isActive: boolean
}

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
