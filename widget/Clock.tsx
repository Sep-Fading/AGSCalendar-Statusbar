import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"

export default function Clock() {
  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format("%a %e %b  %H:%M")!,
  )
  return <label label={time} />
}
