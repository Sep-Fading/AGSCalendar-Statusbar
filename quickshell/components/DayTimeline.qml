import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Item {
  id: timeline

  property int startHour: 9
  property int endHour: 23
  property int hourHeight: 70
  property color textMuted: "#b4b4b4"
  property color accent: "#f38ba8"

  implicitWidth: 300
  implicitHeight: (endHour - startHour + 1) * hourHeight

  function currentDecimalHour() {
    const now = new Date()
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  }

  Rectangle {
    anchors.fill: parent
    color: "transparent"

    RowLayout {
      anchors.fill: parent
      spacing: 12

      ColumnLayout {
        spacing: 0
        Layout.preferredWidth: 44

        Repeater {
          model: endHour - startHour + 1
          delegate: Label {
            text: `${startHour + index}:00`
            color: timeline.textMuted
            font.pixelSize: 12
            Layout.preferredHeight: hourHeight
            horizontalAlignment: Text.AlignRight
            verticalAlignment: Text.AlignTop
          }
        }
      }

      Item {
        id: grid
        Layout.fillWidth: true
        Layout.fillHeight: true

        Repeater {
          model: endHour - startHour + 1
          delegate: Rectangle {
            width: grid.width
            height: 1
            y: index * hourHeight
            color: "#ffffff1f"
          }
        }

        Rectangle {
          id: currentLine
          width: grid.width
          height: 2
          color: timeline.accent
          visible: false

          Rectangle {
            anchors.centerIn: parent
            width: parent.width
            height: parent.height
            color: timeline.accent
            opacity: 0.4
          }
        }
      }
    }
  }

  function updateLine() {
    const nowHour = currentDecimalHour()
    const y = (nowHour - startHour) * hourHeight
    if (nowHour >= startHour && nowHour <= endHour + 1) {
      currentLine.visible = true
      currentLine.y = y
    } else {
      currentLine.visible = false
    }
  }

  Component.onCompleted: updateLine()

  Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: timeline.updateLine()
  }
}
