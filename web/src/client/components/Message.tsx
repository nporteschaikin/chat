import * as React from "react"

import { store } from "./../store"
import { Message as MessageType } from "./../types"
import UserAvatar from "./UserAvatar"

// @ts-ignore
import styles from "./../styles/message.module"

const MessageDetails: React.FC<{ message: MessageType }> = ({ message }) => (
  <div className={styles.details}>
    {message.author !== null && (
      <>
        <strong>{message.author.displayName}</strong>
        <span className={styles.signature}>
          {" "}
          {message.author.formattedHandle} &bull;{" "}
          {new Date(message.createdAt).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>
      </>
    )}
  </div>
)

const MessageBody: React.FC<{ message: MessageType }> = ({ message }) => (
  <div className={styles.body}>{message.body}</div>
)

const Message: React.FC<{ message: MessageType }> = ({ message }) => {
  const { state } = React.useContext(store)
  const { authenticatedUser } = state

  return (
    <li className={styles.root}>
      <div>
        <UserAvatar
          size={35}
          user={message.author}
          showState={message.author !== null && message.author.id == authenticatedUser!.id}
        />
      </div>
      <div>
        <MessageDetails message={message} />
        <MessageBody message={message} />
      </div>
    </li>
  )
}

export default Message
