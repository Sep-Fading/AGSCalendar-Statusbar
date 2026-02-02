import app from "ags/gtk4/app"
import Bar from "./widget/Bar"
import { DayCalendarWindow } from "./widget/DayCalendar.tsx" // Make sure the path is correct
import scss from "./style.scss"
import { Gdk } from "ags/gtk4"

app.start({
  css: scss,
  main() {
    const bars = new Map()
    const monitors = app.get_monitors()

    for (const gdkmonitor of monitors) {
      bars.set(gdkmonitor, Bar(gdkmonitor))

      /* //Only add the Calendar to the FIRST monitor (Primary)
      if (gdkmonitor === monitors[0]) {
        DayCalendarWindow(gdkmonitor)
      }*/

      DayCalendarWindow(gdkmonitor)
    }
  },
})
