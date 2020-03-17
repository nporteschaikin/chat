import * as React from "react"

import Avatar from "./Avatar"

// @ts-ignore
import styles from "./../styles/avatar.module"

interface Props {
  size: number
  avatars: { url: string | null; tooltip?: string }[]
}

const AvatarGroup: React.FC<Props> = (props) => (
  <div className={styles.group}>
    {props.avatars.map((avatar, index) => (
      <Avatar
        key={`${index}.${avatar.url}`}
        url={avatar.url}
        tooltip={avatar.tooltip}
        size={props.size}
        style={{ marginLeft: `${props.size * 0.25 * -1}px` }}
      />
    ))}
  </div>
)

export default AvatarGroup
