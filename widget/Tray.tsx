import { Gtk } from "ags/gtk4"
import AstalTray from "gi://AstalTray?version=0.1"
import { For, createBinding } from "ags"

export default function Tray() {
  const tray = AstalTray.get_default()

  return (
    <box spacing={6}>
      <For each={createBinding(tray, "items")}>
        {(item) => (
          <menubutton
            tooltipText={createBinding(item, "tooltipText")}
            $={(self) => {
              // dbusmenu
              self.menuModel = item.menuModel
              self.insert_action_group("dbusmenu", item.actionGroup)

              const img = Gtk.Image.new_from_gicon(item.gicon)
              self.set_child(img)
            }}
          ></menubutton>
        )}
      </For>
    </box>
  )
}
