import * as React from "react"

import Navigation from "./Navigation"

// @ts-ignore
import styles from "./../styles/dashboard.module"

const Dashboard: React.FC = ({ children }) => (
  <div className={styles.root}>
    <Navigation />
    {children}
  </div>
)

export default Dashboard
