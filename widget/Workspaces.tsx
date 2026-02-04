import Hyprland from "gi://AstalHyprland"
import { Gtk } from "ags/gtk4"

export default function Workspaces() {
  const hypr = Hyprland.get_default()

  // 1. Create the Pill Widget
  const pill = (
    <box
      halign={Gtk.Align.START}
      valign={Gtk.Align.CENTER}
      cssClasses={["Workspaces-Active-Pill"]}
    />
  ) as Gtk.Box

  // 2. Logic to update the Pill's position
  const updatePill = () => {
    const fw = hypr.focused_workspace
    const wsList = hypr.get_workspaces().sort((a, b) => a.id - b.id)
    const index = wsList.findIndex((w) => w.id === fw?.id)
    const pos = index !== -1 ? index * 32 : 0
    // In Gnim, 'css' is a property you can set directly on the widget
    pill.css = `transform: translateX(${pos}px);`
  }

  // 3. Connect signals manually
  hypr.connect("notify::focused-workspace", updatePill)
  hypr.connect("notify::workspaces", updatePill)

  // Initial run to set position
  updatePill()

  return (
    <overlay cssClasses={["Workspaces-Container"]}>
      {pill}
      <box spacing={0} halign={Gtk.Align.START}>
        {hypr
          .get_workspaces()
          .sort((a, b) => a.id - b.id)
          .filter((w) => w.id >= 1)
          .map((wsItem) => {
            const btn = (
              <button
                onClicked={() => wsItem.focus()}
                cssClasses={
                  hypr.focused_workspace?.id === wsItem.id
                    ? ["workspace-btn", "focused"]
                    : ["workspace-btn"]
                }
              >
                <label label={wsItem.id.toString()} widthRequest={32} />
              </button>
            ) as Gtk.Button

            // Update individual button classes when focus changes
            hypr.connect("notify::focused-workspace", () => {
              if (hypr.focused_workspace?.id === wsItem.id) {
                btn.add_css_class("focused")
              } else {
                btn.remove_css_class("focused")
              }
            })

            return btn
          })}
      </box>
    </overlay>
  )
}
