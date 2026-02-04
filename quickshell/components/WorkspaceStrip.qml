import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import Quickshell.Hyprland

Item {
  id: workspaceStrip

  property color background: "#000000"
  property color text: "#ffffff"
  property color textMuted: "#b4b4b4"

  implicitHeight: 28
  implicitWidth: row.implicitWidth

  Hyprland.WorkspacesModel {
    id: workspaces
  }

  Rectangle {
    radius: 8
    color: workspaceStrip.background
    anchors.verticalCenter: parent.verticalCenter

    RowLayout {
      id: row
      anchors.margins: 4
      anchors.fill: parent
      spacing: 6

      Repeater {
        model: workspaces

        delegate: Rectangle {
          required property int id
          required property string name
          required property bool focused

          radius: 6
          width: 32
          height: 24
          color: focused ? workspaceStrip.text : "transparent"
          border.color: focused ? "transparent" : "#ffffff22"
          border.width: focused ? 0 : 1

          Label {
            anchors.centerIn: parent
            text: name
            color: focused ? "#000000" : workspaceStrip.textMuted
            font.pixelSize: 13
            font.weight: focused ? Font.DemiBold : Font.Normal
          }

          MouseArea {
            anchors.fill: parent
            onClicked: workspaces.activateWorkspace(id)
          }
        }
      }
    }
  }
}
