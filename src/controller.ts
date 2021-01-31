const KEYBOARD: Record<string, { state: boolean; active: boolean }> = {};
const GAMEPADS: Record<string, Gamepad> = {};

onkeydown = onkeyup = (ev) => {
  const key = ev.key.toLowerCase();
  const newState = ev.type[3] === "d";

  if (newState !== KEYBOARD[key]?.state) {
    KEYBOARD[key] = {
      state: newState,
      active: newState,
    };
  }
};

window.addEventListener("gamepadconnected", (ev: any) => {
  const gamepad: Gamepad = ev.gamepad;
  
  GAMEPADS[gamepad.id] = gamepad;
});

window.addEventListener("gamepaddisconnected", (ev: any) => {
  const gamepad: Gamepad = ev.gamepad;
  
  delete GAMEPADS[gamepad.id];
});

export class KeyboardController {
  constructor(private keys: ControllerData) {}

  get up() {
    return KEYBOARD[this.keys.up]?.active;
  }
  get down() {
    return KEYBOARD[this.keys.down]?.active;
  }
  get left() {
    return KEYBOARD[this.keys.left]?.active;
  }
  get right() {
    return KEYBOARD[this.keys.right]?.active;
  }
}

export class GamepadController {
  private id: string;
  
  constructor(gamepadId = navigator.getGamepads()[0]?.id) {
    this.id = gamepadId;
  }
  
  get up() {
    const buttonPressed = GAMEPADS[this.id].buttons[12].pressed;
    const stickMoved = GAMEPADS[this.id].axes[1] < -0.5;

    return buttonPressed || stickMoved;
  }
  get down() {
    const buttonPressed = GAMEPADS[this.id].buttons[13].pressed;
    const stickMoved = GAMEPADS[this.id].axes[1] > 0.5;
  
    return buttonPressed || stickMoved;
  }
  get left() {
    const buttonPressed = GAMEPADS[this.id].buttons[14].pressed;
    const stickMoved = GAMEPADS[this.id].axes[0] < -0.5;
  
    return buttonPressed || stickMoved;
  }
  get right() {
    const buttonPressed = GAMEPADS[this.id].buttons[15].pressed;
    const stickMoved = GAMEPADS[this.id].axes[0] > 0.5;
  
    return buttonPressed || stickMoved;
  }

}