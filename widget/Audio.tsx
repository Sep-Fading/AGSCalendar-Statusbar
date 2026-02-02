import { Astal, Gtk, Gdk } from "ags/gtk4"
import Wp from "gi://AstalWp?version=0.1"
import { execAsync } from "ags/process"
import { createBinding, For } from "ags"

export default function Audio() {
  const speaker = Wp.get_default()?.get_default_speaker()

  if (!speaker) return <box /> // Make some warning or somethig later.

  return (
    <button
      cssClasses={["AudioBtn"]}
      onClicked={() => execAsync("pavucontrol")}
      $={(self) => {
        const scroll = new Gtk.EventControllerScroll({
          flags: Gtk.EventControllerScrollFlags.VERTICAL,
        })

        scroll.connect("scroll", (_, _dx, dy) => {
          const step = 0.01
          if (dy < 0) {
            speaker.volume = Math.min(1.5, speaker.volume + step)
          } else {
            speaker.volume = Math.max(0, speaker.volume - step)
          }
          return true
        })
        self.add_controller(scroll)
      }}
    >
      <box spacing={2}>
        <image iconName={createBinding(speaker, "volume_icon")} />
        <label
          label={createBinding(
            speaker,
            "volume",
          )((v) => `${Math.floor(v * 100)}%`)}
        />
      </box>
    </button>
  )
}
