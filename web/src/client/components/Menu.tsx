import * as React from "react"
import classnames from "classnames"
import { createPortal } from "react-dom"
import { Manager, Reference, Popper } from "react-popper"

// @ts-ignore
import styles from "./../styles/menu.module"

interface MenuIconButtonProps {
  renderIcon: () => JSX.Element
  onClick: () => void
}

interface MenuCardProps {
  renderItems: () => JSX.Element
  isVisible: boolean
}

interface Props {
  renderItems: () => JSX.Element
  children: (ref: React.Ref<any>) => JSX.Element
  isVisible: boolean
}

export const MenuIconButton: React.FC<MenuIconButtonProps> = (props) => (
  <li onClick={props.onClick} className={styles["icon-button"]}>
    <div>{props.children}</div>
    <div>{props.renderIcon()}</div>
  </li>
)

const MenuCard: React.FC<MenuCardProps> = (props) => {
  return (
    <ul
      style={{ zIndex: 9999 }}
      className={classnames(styles.card, { [styles.visible]: props.isVisible })}>
      {props.renderItems()}
    </ul>
  )
}

const Menu: React.FC<Props> = (props) => (
  <Manager>
    <Reference>{({ ref }) => props.children(ref)}</Reference>
    {createPortal(
      <Popper>
        {({ placement, ref, style }) => (
          <div ref={ref} style={style} data-placement={placement}>
            <MenuCard renderItems={props.renderItems} isVisible={props.isVisible} />
          </div>
        )}
      </Popper>,
      document.body
    )}
  </Manager>
)

export default Menu
