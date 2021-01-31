import { player } from "./index";

export const canvas = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");

export let CANVAS_SIZE = 480,
  TILE_SIZE = 32,
  MAZE_SIZE = 15;

function resizeThings() {
  let lastSize = CANVAS_SIZE;

  CANVAS_SIZE = Math.min(innerWidth, innerHeight) - 10;
  CANVAS_SIZE -= CANVAS_SIZE % MAZE_SIZE;

  TILE_SIZE = Math.floor(CANVAS_SIZE / MAZE_SIZE);

  canvas.width = canvas.height = CANVAS_SIZE;

  if (!player) return;
  
  let playerOffset = CANVAS_SIZE / lastSize;
  player.x *= playerOffset;
  player.y *= playerOffset;
}

onresize = resizeThings;
resizeThings();