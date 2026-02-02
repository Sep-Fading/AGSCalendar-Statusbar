import { Astal, Gtk, Gdk } from "ags/gtk4"

import { createBinding, For } from "ags"

import AstalBattery from "gi://AstalBattery?version=0.1"
import AstalNetwork from "gi://AstalNetwork?version=0.1"
import AstalBluetooth from "gi://AstalBluetooth?version=0.1"
import Tray from "./Tray.tsx"
import Audio from "./Audio.tsx"

export default function Info() {
  const battery = AstalBattery.get_default()
  const network = AstalNetwork.get_default()
  const bluetooth = AstalBluetooth.get_default()

  return (
    <box spacing={8} cssClasses={["InfoIsland"]}>
      <Tray />
      <box visible={createBinding(bluetooth, "isPowered")}>
        <image iconName="bluetooth-active-symbolic" />
      </box>
      <box>
        <image iconName={createBinding(network.wifi, "iconName")} />
      </box>
      <Audio />
      <box visible={createBinding(battery, "isPresent")} spacing={2}>
        <image iconName={createBinding(battery, "iconName")} />
        <label
          label={createBinding(
            battery,
            "percentage",
          )((p) => `${Math.floor(p * 100)}%`)}
        />
      </box>
    </box>
  )
}
