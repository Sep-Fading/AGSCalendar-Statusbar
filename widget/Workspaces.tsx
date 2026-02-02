import Hyprland from "gi://AstalHyprland"
import { For, createBinding } from "ags"
import { Gtk } from "ags/gtk4"

export default function Workspaces() {
  const hypr = Hyprland.get_default()

  const workspaces = createBinding(hypr, "workspaces").as((ws) =>
    ws.sort((a, b) => a.id - b.id).filter((ws) => ws.id >= 1),
  )

  const focused = createBinding(hypr, "focused_workspace")

  return (
    <box spacing={4}>
      <For each={workspaces}>
        {(ws) => (
          <button
            onClicked={() => ws.focus()}
            cssClasses={focused((fw) =>
              fw?.id === ws.id
                ? ["workspace-btn", "focused"]
                : ["workspace-btn"],
            )}
          >
            <label label={ws.id.toString()} />
          </button>
        )}
      </For>
    </box>
  )
}
