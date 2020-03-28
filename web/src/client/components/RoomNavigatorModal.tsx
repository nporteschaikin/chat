import * as React from "react"

import Modal, { ModalManager } from "./Modal"
import RoomSearchDialog from "./RoomSearchDialog"

interface Props {
  isVisible: boolean
  onClick: () => void
  onNavigate: () => void
}

export const RoomNavigatorModalManager = ModalManager

const RoomNavigatorModal: React.FC<Props> = ({ isVisible, onClick, onNavigate }) => (
  <Modal isVisible={isVisible} onClick={onClick}>
    <RoomSearchDialog isVisible={isVisible} onNavigate={onNavigate} />
  </Modal>
)

export default RoomNavigatorModal
