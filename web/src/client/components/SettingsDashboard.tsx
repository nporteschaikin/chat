import * as React from "react"

import SettingsNavigation from "./SettingsNavigation"

// @ts-ignore
import styles from "./../styles/settings-dashboard.module"

const SettingsDashboard: React.FC = ({ children }) => (
  <div className={styles.root}>
    <SettingsNavigation />
    {children}
  </div>
)

export default SettingsDashboard
