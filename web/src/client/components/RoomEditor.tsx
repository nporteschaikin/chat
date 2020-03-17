import * as React from "react"
import classnames from "classnames"

import { store } from "./../store"
import { sendRoomMessage, sendRoomKeydown } from "./../actions"
import { Room } from "./../types"
import Editor from "./Editor"
import AvatarGroup from "./AvatarGroup"

// @ts-ignore
import styles from "./../styles/room.module"

interface Props {
  room: Room
}

const RoomTypingBar: React.FC<Props> = ({ room }) => {
  const { state } = React.useContext(store)
  const keydowns = state.roomKeydowns[room.handle] || []

  return (
    <div className={classnames(styles.typing, { [styles["typing-visible"]]: keydowns.length > 0 })}>
      {keydowns.length > 0 && (
        <>
          <AvatarGroup
            size={15}
            avatars={keydowns.slice(0, 5).map((keydown) => ({
              url: keydown.userAvatarUrl,
              tooltip: keydown.userHandle,
            }))}
          />
          <div>{keydowns.length === 1 ? "One person" : `${keydowns.length} people`} typing...</div>
        </>
      )}
    </div>
  )
}

const RoomEditor: React.FC<Props> = ({ room }) => {
  const { dispatch } = React.useContext(store)
  const onSubmit = (body) => dispatch(sendRoomMessage(room.handle, body))
  const onKeyDown = () => dispatch(sendRoomKeydown(room.handle))

  return (
    <div className={styles.editor}>
      <RoomTypingBar room={room} />
      <Editor onSubmit={onSubmit} onKeyDown={onKeyDown} />
    </div>
  )
}

export default RoomEditor
