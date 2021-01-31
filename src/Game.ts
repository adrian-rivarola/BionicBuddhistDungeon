import { CANVAS_SIZE, TILE_SIZE, ctx, MAZE_SIZE } from "./setup";
import { createMaze } from "./maze";
import { gameOverScreen } from "./index";
import Player from "./player";

export default class Game {
  grid: Maze;
  startPosition: {
    x: number;
    y: number;
  };
  isBlindfold = false;
  battery: number;
  paused = true;
  colors = ["teal", "#333", "yellow", "red"];

  constructor(public player: Player) {}

  configPlayer(difficulty: DIFFICULTY) {
    this.player.x = this.startPosition.x;
    this.player.y = this.startPosition.y;
    this.player.direction = "UP";

    this.player.light = { ...PLAYER_LIGHTS[difficulty] };
    this.player.ligthDistance = 0;
  }

  drawTile(x: number, y: number, num: number) {
    ctx.save();

    ctx.fillStyle = this.colors[num];
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // ctx.strokeStyle = "black";
    // ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.restore();
  }

  renderTime() {
    ctx.save();

    ctx.strokeStyle = this.battery > 3 ? "white" : "red";

    ctx.font = "1rem monospace";

    const txt = `Battery: ${Math.ceil(this.battery)}mAh`;

    ctx.strokeText(txt, TILE_SIZE / 2, TILE_SIZE / 2);

    ctx.restore();
  }

  renderMaze() {
    const { x, y } = this.player.gridPos;

    if (!this.paused && this.grid[y][x] === 3) {
      this.end();
    }

    let displaySize = Math.floor(this.player.light?.distance) + 1;

    for (let i = x - displaySize; i <= x + displaySize; i++) {
      for (let j = y - displaySize; j <= y + displaySize; j++) {
        this.grid[j] && this.drawTile(i, j, this.grid[j][i]);
      }
    }
  }

  renderBackground() {
    ctx.save();
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.restore();
  }

  render() {
    if (!this.isBlindfold) {
      this.battery -= 0.003;
      this.battery < 0 && this.end();
    }

    this.player.update(this.grid);

    this.renderBackground();

    this.renderMaze();

    this.player.render();

    this.renderTime();

    !this.paused && requestAnimationFrame(() => this.render());
  }

  start(difficulty: DIFFICULTY) {
    this.grid = createMaze(15);

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid.length; x++) {
        if (this.grid[y][x] === 2) {
          this.startPosition = {
            x: x * TILE_SIZE + TILE_SIZE / 2,
            y: y * TILE_SIZE + TILE_SIZE / 2,
          };
          if (this.grid[y - 1]) {
            this.grid[y - 1][x] = 0;
          }
        }
      }
    }

    this.paused = false;
    this.isBlindfold = difficulty === "blindfold";

    this.battery = BATTERY[difficulty];
    this.configPlayer(difficulty);

    requestAnimationFrame(() => this.render());
  }

  end() {
    this.paused = true;

    this.player.onGameOver();

    const txt =
      this.battery > 0 || this.isBlindfold ? "You Won!" : "You Lost :(";

    const title = gameOverScreen.children.item(0);
    title.innerHTML = txt;

    const detail = gameOverScreen.children.item(1);
    detail.innerHTML = `Battery remaining: ${Math.ceil(this.battery)} mAh`;

    gameOverScreen.style.display = "flex";

    this.renderGameOverScreen();
  }

  renderGameOverScreen() {
    this.renderMaze();

    this.player.render();

    requestAnimationFrame(() => this.renderGameOverScreen());
  }
}

const BATTERY = {
  easy: 15,
  normal: 10,
  hard: 5,
  blindfold: 0,
};

const PLAYER_LIGHTS = {
  easy: {
    brightness: 1,
    distance: 4,
    angle: 140,
  },
  normal: {
    brightness: 0.75,
    distance: 2.5,
    angle: 120,
  },
  hard: {
    brightness: 0.5,
    distance: 1.25,
    angle: 90,
  },
  blindfold: null,
};
