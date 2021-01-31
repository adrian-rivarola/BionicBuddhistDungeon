interface Ligth {
  brightness: number;
  distance: number;
  angle: number;
}

type DIRECTION = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface iPlayer {
  x: number;
  y: number;
  radius: number;

  vx: number;
  vy: number;
  acc: number;

  direction: DIRECTION;
  ligth?: Ligth

  move(): void;
  update(grid: Array<Array<number>>): void;
  render(): void;
}
