export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

const ANGLES: Record<string, number> = {
  "UP": 270,
  "DOWN": 90,
  "LEFT": 180,
  "RIGHT": 0,
}

export function clamp(min: number, max: number, num: number) {
  return Math.max(min, Math.min(num, max));
}

export function getAngle(direction: string) {
  return ANGLES[direction];
}
