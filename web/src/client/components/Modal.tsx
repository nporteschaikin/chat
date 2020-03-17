import * as React from "react"
import classnames from "classnames"
import { createPortal } from "react-dom"

// @ts-ignore
import styles from "./../styles/modal.module"

interface Props {
  isVisible: boolean
  onClick: () => void
  ref?: React.MutableRefObject<HTMLDivElement | undefined>
}

interface ManagerProps {
  children: (isVisible: boolean, setVisible: (isVisible: boolean) => any) => JSX.Element
}

export const ModalManager: React.SFC<ManagerProps> = ({ children }) => {
  const [isVisible, setVisible] = React.useState<boolean>(false)

  return children(isVisible, setVisible)
}

// @ts-ignore
const Modal: React.FC<Props> = React.forwardRef<React.FC<Props>>(
  // @ts-ignore
  ({ isVisible, children, ...rest }, ref) =>
    createPortal(
      <div
        // @ts-ignore
        ref={ref}
        {...rest}
        className={classnames(styles.root, { [styles.visible]: isVisible })}>
        <div className={styles.background}>
          <div className={styles.primary}>{children}</div>
        </div>
      </div>,
      document.body
    )
)

export default Modal
