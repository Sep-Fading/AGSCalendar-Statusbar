import { Gtk, Gdk, Astal } from "ags/gtk4"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"

// --- Configuration ---
const START_HOUR = 9
const END_HOUR = 23
const HOUR_HEIGHT = 80
const CALENDAR_WIDTH = 250
const TIMELINE_LEFT_OFFSET = 60
const TOTAL_HEIGHT = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT

// --- Helpers ---

function getDecimalHour(): number {
  const now = new Date()
  // Use precise milliseconds to prevent any rounding lag
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
}

function getTaskY(dateStr: string): number {
  if (!dateStr) return -1
  const year = parseInt(dateStr.slice(0, 4))
  const month = parseInt(dateStr.slice(4, 6)) - 1
  const day = parseInt(dateStr.slice(6, 8))
  const hour = parseInt(dateStr.slice(9, 11))
  const min = parseInt(dateStr.slice(11, 13))

  const date = new Date(Date.UTC(year, month, day, hour, min))
  const localHours = date.getHours() + date.getMinutes() / 60
  return (localHours - START_HOUR) * HOUR_HEIGHT
}

async function fetchDayTasks() {
  const now = new Date()
  const filter = now.getHours() >= 23 ? "due:tomorrow" : "due:today"
  try {
    const out = await execAsync([
      "task",
      "rc:~/.taskrc",
      "status:pending",
      filter,
      "export",
    ]).catch(() => "[]")
    return JSON.parse(out.trim() || "[]")
  } catch (e) {
    return []
  }
}

function TaskBlock({ task }: { task: any }) {
  return (
    <box cssClasses={["CalendarTask"]} widthRequest={CALENDAR_WIDTH - 20}>
      <label
        label={task.description}
        maxWidthChars={20}
        ellipsize={3}
        wrap
        halign={Gtk.Align.START}
      />
    </box>
  )
}

// --- Main Widget ---

export default function DayCalendar() {
  const tasks = createPoll([], 30000, fetchDayTasks)

  const timeline = new Gtk.Box({
    css_classes: ["CurrentTimeLine"],
    width_request: CALENDAR_WIDTH,
    height_request: 2,
    visible: false,
  })

  const fixed = new Gtk.Fixed({
    css_classes: ["TimelineArea"],
    width_request: CALENDAR_WIDTH,
    height_request: TOTAL_HEIGHT,
  })
  fixed.put(timeline, 0, 0)

  const headerLabel = new Gtk.Label({
    css_classes: ["CalendarHeader"],
    halign: Gtk.Align.CENTER,
  })

  const updateUI = () => {
    const currentH = getDecimalHour()
    // The core math: (Current - Start) * Height
    const y = (currentH - START_HOUR) * HOUR_HEIGHT

    const now = new Date()
    headerLabel.label =
      now.getHours() >= 23 ? "📅 Schedule: Tomorrow" : "📅 Schedule: Today"

    if (currentH >= START_HOUR && currentH <= END_HOUR + 1) {
      timeline.visible = true
      fixed.move(timeline, 0, y)
    } else {
      timeline.visible = false
    }
    return true
  }

  const timerId = setInterval(updateUI, 1000)
  updateUI()

  tasks((list) => {
    let child = fixed.get_first_child()
    while (child) {
      const next = child.get_next_sibling()
      if (child !== timeline) fixed.remove(child)
      child = next
    }
    if (list && list.length > 0) {
      list.forEach((t: any) => {
        const y = getTaskY(t.due)
        if (y >= 0 && y <= TOTAL_HEIGHT) {
          fixed.put(<TaskBlock task={t} />, 10, y)
        }
      })
    }
  })

  return (
    <box
      orientation={Gtk.Orientation.VERTICAL}
      cssClasses={["CalendarWidget"]}
      vexpand
    >
      {headerLabel}
      <scrolledwindow
        vexpand
        propagateNaturalWidth
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
      >
        <box orientation={Gtk.Orientation.HORIZONTAL}>
          {/* Time labels column */}
          <box
            orientation={Gtk.Orientation.VERTICAL}
            widthRequest={TIMELINE_LEFT_OFFSET}
          >
            {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => (
              <label
                label={`${START_HOUR + i}:00`}
                heightRequest={HOUR_HEIGHT}
                valign={Gtk.Align.START}
                halign={Gtk.Align.END}
                cssClasses={["TimeLabel"]}
              />
            ))}
          </box>
          {fixed}
        </box>
      </scrolledwindow>
    </box>
  )
}

export function DayCalendarWindow(monitor: Gdk.Monitor) {
  return (
    <window
      name="day-calendar"
      gdkmonitor={monitor}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT
      }
      layer={Astal.Layer.BACKGROUND}
      exclusivity={Astal.Exclusivity.NONE}
      focusable={false}
      cssClasses={["CalendarWindow"]}
      visible={true}
    >
      <box
        halign={Gtk.Align.START}
        valign={Gtk.Align.FILL}
        cssClasses={["CalendarWindowContainer"]}
      >
        <DayCalendar />
      </box>
    </window>
  )
}
