import * as React from "react"

import { Room } from "./../types"
import { store } from "./../store"
import { LoadingScreen } from "./Loader"
import Message from "./Message"

// @ts-ignore
import styles from "./../styles/room.module"

const RoomMessages: React.FC<{ room: Room }> = ({ room }) => {
  const { state } = React.useContext(store)

  const ref = React.useRef<HTMLDivElement>(null)
  const { current } = ref

  const messages = state.roomMessages[room.id]
  const onMessagesLengthChange = () => {
    if (current === null) return

    const { scrollTop, scrollHeight, offsetHeight, clientHeight } = current!

    if (scrollTop > scrollHeight - offsetHeight - clientHeight * 0.25) {
      current.scrollTop = scrollHeight
    }
  }

  React.useEffect(onMessagesLengthChange, [(messages || []).length])

  if (!messages) {
    return <LoadingScreen />
  }

  return (
    <div className={styles.messages} ref={ref}>
      <ul>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </ul>
    </div>
  )
}

export default RoomMessages
