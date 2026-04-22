# firefox-msteams-helper

This is a simple [Firefox] addon.

## Usage

### Installation

:warning: _TODO_

### Functionality

All hotkeys/keybinds use the Shift+Alt modifier. Followed by:

- `!` (1) - Toggle raised hand status
- `@` (2) - Heart/love reaction
- `#` (3) - Applause reaction
- `$` (4) - Laugh reaction
- `%` (5) - Surprised reaction

## Roadmap

- Some sort of configuration store.
  - Customized modifier.
  - Customized key mapping.
  - Key mapping collision detection.

    ie. If there's another keydown listener that conflicts in some way.
    Though this is likely very non-trivial to detect...

- Remove artificial delay (`setTimeout`) when detecting if a button exists.

  This was introduced to ensure that if a described button doesn't exist, it
  is likely because we are trying to click a reaction but the reactions
  toobar is not visible. So we click the reactions menu button, wait 500ms
  in a deadreckoning fashion to hope that the toolbar is available after
  that, followed by trying to find & click the reaction button element.

- Addon signing.
- Addon packaging.
- Addon publishing.

[Firefox]: https://www.firefox.com "Find your way back to a better internet"
