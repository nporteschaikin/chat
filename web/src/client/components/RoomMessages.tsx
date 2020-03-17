import * as React from "react"

import Message from "./Message"
import { Room } from "./../types"
import { store } from "./../store"

// @ts-ignore
import styles from "./../styles/room.module"

const RoomMessages: React.FC<{ room: Room }> = ({ room }) => {
  const { state } = React.useContext(store)

  const ref = React.useRef<HTMLDivElement>(null)
  const { current } = ref

  const messages = state.roomMessages[room.handle] || []
  const onMessagesLengthChange = () => {
    if (current === null) return

    const { scrollTop, scrollHeight, offsetHeight, clientHeight } = current!

    if (scrollTop > scrollHeight - offsetHeight - clientHeight * 0.25) {
      current.scrollTop = scrollHeight
    }
  }

  React.useEffect(onMessagesLengthChange, [messages.length])

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
