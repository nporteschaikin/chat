import * as React from "react"
import classnames from "classnames"

// @ts-ignore
import styles from "./../styles/editor.module"

interface Props {
  onSubmit: (text: string) => void
  onKeyDown: (code: number) => void
}

const Editor: React.FC<Props> = (props) => {
  const [text, setText] = React.useState<string>("")
  const ref = React.useRef<HTMLDivElement>(null)

  const onChange = () => setText(ref.current!.innerText.trim())

  const onKeyDown = (event) => {
    const { current } = ref

    if (event.keyCode === 13) {
      event.preventDefault()

      if (text.length > 0) {
        props.onSubmit(text)
        current!.innerText = ""
      }
    } else {
      props.onKeyDown(event.keyCode)
    }
  }

  React.useEffect(() => {
    const { current } = ref

    current!.addEventListener("input", onChange)
    current!.addEventListener("keydown", onKeyDown)

    return () => {
      current!.removeEventListener("input", onChange)
      current!.removeEventListener("keydown", onKeyDown)
    }
  })

  return (
    <div className={styles.root}>
      <div className={styles.textarea} ref={ref} contentEditable={true} />
      <div className={classnames(styles.placeholder, { [styles.visible]: text.length === 0 })}>
        What's up?
      </div>
    </div>
  )
}

export default Editor
