import { randomNumber } from "./utils";

let grid: Maze;

export function createMaze(dimensions, numDoors = 1): Maze {
  grid = new Array();

  for (var i = 0; i < dimensions; i++) {
    grid[i] = new Array();

    for (var j = 0; j < dimensions; j++) {
      grid[i][j] = 0;
    }
  }

  addOuterWalls();
  var ent = addEntrance();
  addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2, ent);

  createGoal();

  return grid;
}

function createGoal(y = 0) {
  const validXPos = [];

  for (let i = 0; i < grid.length; i++) {
    if (grid[y][i] === 0) validXPos.push(i);
  }

  if (validXPos.length === 0) {
    return createGoal(y + 1);
  }

  let x = validXPos[randomNumber(0, validXPos.length - 1)];
  grid[y][x] = 3;
}

function addOuterWalls() {
  for (var i = 0; i < grid.length; i++) {
    if (i == 0 || i == grid.length - 1) {
      for (var j = 0; j < grid.length; j++) {
        grid[i][j] = 1;
      }
    } else {
      grid[i][0] = 1;
      grid[i][grid.length - 1] = 1;
    }
  }
}

function addEntrance() {
  var x = randomNumber(1, grid.length - 1);
  grid[grid.length - 1][x] = 2;
  return x;
}

function addInnerWalls(h, minX, maxX, minY, maxY, gate) {
  if (h) {
    if (maxX - minX < 2) {
      return;
    }

    var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
    addHWall(minX, maxX, y);

    addInnerWalls(!h, minX, maxX, minY, y - 1, gate);
    addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
  } else {
    if (maxY - minY < 2) {
      return;
    }

    var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
    addVWall(minY, maxY, x);

    addInnerWalls(!h, minX, x - 1, minY, maxY, gate);
    addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
  }
}

function addHWall(minX, maxX, y) {
  var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

  for (var i = minX; i <= maxX; i++) {
    if (i == hole) grid[y][i] = 0;
    else grid[y][i] = 1;
  }
}

function addVWall(minY, maxY, x) {
  var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

  for (var i = minY; i <= maxY; i++) {
    if (i == hole) grid[i][x] = 0;
    else grid[i][x] = 1;
  }
}