import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"
import Workspaces from "./Workspaces"
import Clock from "./Clock"
import Info from "./Info.tsx"
import TaskSchedule, { TaskBacklog } from "./Tasks.tsx"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <box
          $type="start"
          cssClasses={["WorkspacesIsland"]}
          halign={Gtk.Align.START}
        >
          <Workspaces />
        </box>

        <box
          $type="center"
          cssClasses={["DateIsland"]}
          halign={Gtk.Align.CENTER}
        >
          <Clock />
        </box>

        <box $type="end" halign={Gtk.Align.END} spacing={4}>
          <TaskBacklog />
          <TaskSchedule />
          <Info />
        </box>
      </centerbox>
    </window>
  )
}
