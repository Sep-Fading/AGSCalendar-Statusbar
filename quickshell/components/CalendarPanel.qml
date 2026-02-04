import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import Quickshell.Widgets

Panel {
  id: calendar

  property color surface: "#1e1e2e"
  property color text: "#ffffff"
  property color textMuted: "#b4b4b4"
  property color accent: "#f38ba8"

  edge: Qt.LeftEdge
  thickness: 360
  exclusive: false

  Rectangle {
    anchors.fill: parent
    color: "transparent"

    Rectangle {
      anchors.fill: parent
      anchors.margins: 12
      radius: 12
      color: calendar.surface
      border.color: "#ffffff1f"
      border.width: 1

      ColumnLayout {
        anchors.fill: parent
        anchors.margins: 16
        spacing: 12

        Label {
          text: Qt.formatDateTime(new Date(), "dddd, MMM d")
          color: calendar.text
          font.pixelSize: 16
          font.weight: Font.DemiBold
        }

        Label {
          text: Qt.formatDateTime(new Date(), "'Schedule ·' HH:mm")
          color: calendar.textMuted
          font.pixelSize: 12
        }

        DayTimeline {
          Layout.fillWidth: true
          Layout.fillHeight: true
          textMuted: calendar.textMuted
          accent: calendar.accent
        }
      }
    }
  }
}
