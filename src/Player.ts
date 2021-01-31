import { clamp, degreesToRadians, getAngle } from "./utils";
import { ctx, MAZE_SIZE, TILE_SIZE, CANVAS_SIZE } from "./setup";

const floor = Math.floor;

const getGridPos = (c: number) => floor(c / TILE_SIZE);

class Player implements iPlayer {
  x: number;
  y: number;
  radius: number;

  vx = 0;
  vy = 0;
  acc = 0.15;

  direction: DIRECTION = "UP";

  light?: Ligth;
  ligthDistance = 0;
  glow = true;

  constructor(public controller: Controller) {
    this.x = 300;
    this.y = 550;
    this.radius = TILE_SIZE / 4;

    this.light = {
      distance: 3,
      angle: 120,
      brightness: 0.75,
    };
  }

  get maxSpeed() {
    return floor(TILE_SIZE / 12);
  }

  get w() {
    return this.radius * 2;
  }

  get h() {
    return this.radius * 2;
  }

  get angle() {
    return getAngle(this.direction) - this.light.angle / 2;
  }

  get gridPos() {
    return {
      x: floor(this.x / TILE_SIZE),
      y: floor(this.y / TILE_SIZE),
    };
  }

  onGameOver() {
    this.light.distance = MAZE_SIZE * 2;
    this.light.brightness = 1;
    this.light.angle = 360;

  }

  accelerate() {
    if (this.controller.up) {
      this.vy -= this.acc;
      this.direction = "UP";
    } else if (this.controller.down) {
      this.vy += this.acc;
      this.direction = "DOWN";
    } else {
      this.vy = 0;
    }
    if (this.controller.left) {
      this.vx -= this.acc;
      this.direction = "LEFT";
    } else if (this.controller.right) {
      this.vx += this.acc;
      this.direction = "RIGHT";
    } else {
      this.vx = 0;
    }

    const limit = this.maxSpeed;

    this.vx = clamp(-limit, limit, this.vx);
    this.vy = clamp(-limit, limit, this.vy);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    this.x = clamp(this.radius, CANVAS_SIZE - this.radius, this.x);
    this.y = clamp(this.radius, CANVAS_SIZE - this.radius, this.y);
  }

  update(grid: Maze) {
    const lastPos = { x: this.x, y: this.y };

    this.accelerate();
    this.move();

    const { x, y } = this.gridPos;

    if (grid[y][x] === 1) {
      this.x = lastPos.x;
      this.y = lastPos.y;
    }

    const leftBorder = x * TILE_SIZE;
    const topBorder = y * TILE_SIZE;

    // horizontal collision
    if (this.x - this.radius < leftBorder) {
      if (grid[y][x - 1] === 1) this.x -= this.vx;
    }
    if (this.x + this.radius > leftBorder + TILE_SIZE) {
      if (grid[y][x + 1] === 1) this.x -= this.vx;
    }

    // vertical collision
    if (this.y - this.radius < topBorder) {
      if (grid[y - 1] && grid[y - 1][x] === 1) this.y -= this.vy;
    } else if (this.y + this.radius > topBorder + TILE_SIZE) {
      if (grid[y + 1] && grid[y + 1][x] === 1) this.y -= this.vy;
    }
  }

  renderLight() {
    if (this.ligthDistance < this.light.distance) {
      this.ligthDistance += 0.05;
    }

    ctx.save();

    let startAngle = degreesToRadians(this.angle);
    let endAngle = degreesToRadians(this.angle + this.light.angle);

    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "destination-atop";
    ctx.globalAlpha = this.light.brightness;

    ctx.moveTo(this.x, this.y);
    ctx.arc(
      this.x,
      this.y,
      TILE_SIZE * this.ligthDistance,
      startAngle,
      endAngle
    );
    ctx.fill();

    ctx.closePath();

    ctx.restore();
  }

  render() {
    ctx.save();

    if (this.light) {
      const leftBorder = this.x - (this.x % TILE_SIZE);
      const topBorder = this.y - (this.y % TILE_SIZE);

      ctx.strokeRect(leftBorder, topBorder, TILE_SIZE, TILE_SIZE);

      // ctx.strokeRect(
      //   this.x - this.radius,
      //   this.y - this.radius,
      //   this.w,
      //   this.h
      // );

      this.renderLight();
    }

    if (this.glow) {
      ctx.beginPath();

      ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2);

      ctx.shadowColor = "yellow";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 10;

      ctx.stroke();

      ctx.closePath();
    }

    ctx.restore();
  }
}

export default Player;
