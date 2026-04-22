async function clickButton(buttonId) {
  const fullButtonId = `#${buttonId}-button`;
  let myElement = document.querySelector(fullButtonId);
  if (!myElement && !reactionsMenuIsOpen()) {
    // The element could not be found but the reactions menu is closed, open
    // the menu first, wait a brief period of time, then attempt finding the
    // button element again.
    document.querySelector("#reaction-menu-button").click();
    await new Promise((r) => setTimeout(r, 500));

    // Now lookup the button element again and hopefully its there.
    myElement = document.querySelector(fullButtonId);
  }
  if (!myElement) {
    console.error(
      `Failed to find element "${fullButtonId}", cannot clickButton(${buttonId})`
    );
    return false;
  }

  // Click the desired button
  myElement.click();

  // Close the reactions menu if its open
  if (reactionsMenuIsOpen()) {
    document.querySelector("#reaction-menu-button").click();
  }
}

async function reactApplause() {
  await clickButton("applause");
}

async function reactLaugh() {
  await clickButton("laugh");
}

async function reactLove() {
  await clickButton("heart");
}

async function reactSurprised() {
  await clickButton("surprised");
}

async function reactThumbsUp() {
  await clickButton("like");
}

function reactionsMenuIsOpen() {
  return document.querySelector('[data-tid="reaction-menu-button-toolbox"]')
    ? true
    : false;
}

async function toggleHandRaise() {
  await clickButton("raisehands");
}

// Listen for custom key presses
window.addEventListener(
  "keydown",
  async function (event) {
    const isShiftAlt = event.shiftKey && event.altKey;
    const key = event.key;

    if (isShiftAlt && ["~", "!", "@", "#", "$", "%"].includes(key)) {
      switch (key) {
        case "~":
          await toggleHandRaise();
          break;
        case "!":
          await reactThumbsUp();
          break;
        case "@":
          await reactLove();
          break;
        case "#":
          await reactApplause();
          break;
        case "$":
          await reactLaugh();
          break;
        case "%":
          await reactSurprised();
          break;
        default:
          console.error(`Unknown key press (${isShiftAlt}) + '${key}'`);
          break;
      }
    }
  },
  false
);
