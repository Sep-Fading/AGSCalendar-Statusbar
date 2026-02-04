import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import Quickshell.Widgets
import Quickshell.Hyprland

Panel {
  id: topBar

  property color surface: "#000000"
  property color text: "#ffffff"
  property color textMuted: "#b4b4b4"

  edge: Qt.TopEdge
  thickness: 40
  exclusive: true

  Rectangle {
    anchors.fill: parent
    color: "transparent"

    RowLayout {
      anchors.fill: parent
      anchors.margins: 8
      spacing: 12

      WorkspaceStrip {
        Layout.alignment: Qt.AlignLeft
        text: topBar.text
        textMuted: topBar.textMuted
        background: topBar.surface
      }

      Item {
        Layout.fillWidth: true
      }

      Clock {
        Layout.alignment: Qt.AlignVCenter
        text: topBar.text
      }

      Item {
        Layout.fillWidth: true
      }

      RowLayout {
        Layout.alignment: Qt.AlignRight | Qt.AlignVCenter
        spacing: 8

        Rectangle {
          color: topBar.surface
          radius: 8
          height: 28
          Layout.minimumWidth: 140

          Label {
            anchors.centerIn: parent
            text: "QuickShell"
            color: topBar.text
            font.pixelSize: 14
            font.weight: Font.Medium
          }
        }

        Rectangle {
          color: topBar.surface
          radius: 8
          height: 28
          Layout.minimumWidth: 140

          Label {
            anchors.centerIn: parent
            text: "Status: Ready"
            color: topBar.text
            font.pixelSize: 14
            font.weight: Font.Medium
          }
        }
      }
    }
  }
}
