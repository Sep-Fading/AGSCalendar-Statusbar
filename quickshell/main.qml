import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Widgets
import Quickshell.Hyprland
import "components"

ShellRoot {
  id: root

  property color surface: "#000000"
  property color surfaceMuted: "#1e1e2e"
  property color text: "#ffffff"
  property color textMuted: "#b4b4b4"
  property color accent: "#f38ba8"

  TopBar {
    id: bar
    screen: Screen.primary
    surface: root.surface
    text: root.text
    textMuted: root.textMuted
  }

  CalendarPanel {
    id: calendar
    screen: Screen.primary
    surface: root.surfaceMuted
    text: root.text
    textMuted: root.textMuted
    accent: root.accent
  }
}
