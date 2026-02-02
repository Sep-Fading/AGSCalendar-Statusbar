import { Gtk } from "ags/gtk4"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"

// --- Helper: Format Time ---
function getRelativeTime(dueStr: string): string {
  if (!dueStr) return ""
  const year = parseInt(dueStr.slice(0, 4))
  const month = parseInt(dueStr.slice(4, 6)) - 1
  const day = parseInt(dueStr.slice(6, 8))
  const hour = parseInt(dueStr.slice(9, 11))
  const min = parseInt(dueStr.slice(11, 13))

  const dueDate = new Date(Date.UTC(year, month, day, hour, min))
  const diffMins = Math.round((dueDate.getTime() - Date.now()) / 60000)

  if (diffMins < 0) return "Overdue"
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  return `${Math.floor(diffHours / 24)}d`
}

// --- Helper: Fetch Task Data ---
async function getTopTask(filter: string) {
  try {
    const out = await execAsync([
      "task",
      "rc:~/.taskrc",
      "status:pending",
      filter,
      "limit:1",
      "rc.report.all.sort=urgency-",
      "export",
    ]).catch(() => "[]")

    const tasks = JSON.parse(out.trim() || "[]")
    return tasks[0] || null
  } catch (e) {
    return null
  }
}

// --- Actions ---

/**
 * Clean Launch:
 * 1. clear: Wipes the initial shell greeting.
 * 2. task: Shows the list.
 * 3. read: Keeps the Alacritty window open without starting a new shell (avoiding the Arch art).
 */
function openAlacritty() {
  console.log("[TASK] Opening watermark-free terminal...")

  // We use 'read' instead of 'exec bash'.
  // This shows the list and keeps the window open until you press any key.
  const internalCmd =
    "clear; task; echo ''; read -n 1 -s -r -p ' Press any key to close...'"
  const launchCmd = `nohup alacritty -T Taskwarrior -e bash -c "${internalCmd}" > /dev/null 2>&1 &`

  execAsync(["bash", "-c", launchCmd]).catch((err) =>
    console.error("[TASK] Launch Error:", err),
  )
}

function completeTask(uuid: string) {
  if (!uuid) return
  console.log(`[TASK] Completing: ${uuid}`)
  execAsync(["task", "rc:~/.taskrc", `uuid:${uuid}`, "done"]).catch((err) =>
    console.error("[TASK] Completion Error:", err),
  )
}

/**
 * TaskButton Component
 */
function TaskButton({
  filter,
  emoji,
  isSchedule,
}: {
  filter: string
  emoji: string
  isSchedule: boolean
}) {
  const data = createPoll(null, 5000, () => getTopTask(filter))

  const btn = (
    <button
      cssClasses={["TaskIsland", isSchedule ? "Schedule" : "Backlog"]}
      visible={data((t) => t !== null)}
      onClicked={openAlacritty}
    >
      <box spacing={8}>
        <label label={emoji} cssClasses={["TaskEmoji"]} />
        {isSchedule ? (
          <box>
            <label
              cssClasses={["TaskDue"]}
              label={data((t) => (t ? getRelativeTime(t.due) + " -" : ""))}
            />
            <label
              label={data((t) => t?.description || "")}
              maxWidthChars={20}
              ellipsize={3}
            />
          </box>
        ) : (
          <label
            label={data((t) => t?.description || "")}
            maxWidthChars={25}
            ellipsize={3}
          />
        )}
      </box>
    </button>
  ) as any

  const gesture = new Gtk.GestureClick()
  gesture.set_button(2)
  gesture.connect("released", () => {
    const task = data.get()
    if (task) completeTask(task.uuid)
  })

  btn.add_controller(gesture)

  return btn
}

// --- EXPORTS ---

export default function TaskSchedule() {
  return <TaskButton filter="due.any:" emoji="📅" isSchedule={true} />
}

export function TaskBacklog() {
  return <TaskButton filter="due.none:" emoji="📋" isSchedule={false} />
}
