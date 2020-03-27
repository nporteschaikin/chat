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

  const messages = state.roomMessages[room.id]
  const onMessagesLengthChange = () => {
    if (ref.current !== null) {
      const { scrollTop, scrollHeight, offsetHeight, clientHeight } = ref.current!

      if (scrollTop === 0 || scrollTop > scrollHeight - offsetHeight - clientHeight * 0.25) {
        ref.current!.scrollTop = ref.current!.scrollHeight
      }
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
