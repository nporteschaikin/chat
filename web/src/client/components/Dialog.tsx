import * as React from "react"

// @ts-ignore
import styles from "./../styles/dialog.module"

const DialogHeader: React.SFC = (props) => <header className={styles.header} {...props} />
const DialogBody: React.SFC = (props) => <div className={styles.body} {...props} />
const DialogFooter: React.SFC = (props) => <footer className={styles.footer} {...props} />

export { DialogHeader, DialogBody, DialogFooter }

const Dialog: React.FC = (props) => (
  <div {...props} className={styles.root} onClick={(event) => event.stopPropagation()} />
)

export default Dialog
