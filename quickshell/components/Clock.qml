import QtQuick
import QtQuick.Controls

Item {
  id: clock
  property color text: "#ffffff"
  property string format: "ddd MMM d · HH:mm"

  implicitHeight: 28
  implicitWidth: label.implicitWidth

  Label {
    id: label
    anchors.centerIn: parent
    color: clock.text
    font.pixelSize: 16
    font.weight: Font.Medium
    text: Qt.formatDateTime(new Date(), clock.format)
  }

  Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: label.text = Qt.formatDateTime(new Date(), clock.format)
  }
}
