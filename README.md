# AGS Calendar Statusbar → Quickshell

This repo now contains a Quickshell-based bar + day timeline widget for Hyprland.

## Run locally

1. Install Quickshell.
2. Point Quickshell at the config directory in this repository:

```bash
quickshell -c /path/to/AGSCalendar-Statusbar/quickshell
```

Alternatively, link the folder into your default config path:

```bash
ln -s /path/to/AGSCalendar-Statusbar/quickshell ~/.config/quickshell
quickshell
```

## What you get

- **Top bar** with Hyprland workspaces, a clock, and placeholder status islands.
- **Left calendar panel** with a day timeline and current time indicator.

All colors and layout values are defined at the top of `quickshell/main.qml` for easy theming.
