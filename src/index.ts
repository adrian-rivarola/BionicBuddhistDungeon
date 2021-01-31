import { KeyboardController } from "./controller";
import Player from "./Player";
import Game from "./Game";

import { canvas, ctx } from "./setup";

export let game: Game, player: Player;

const DIFFICULTY_LIST = ["easy", "normal", "hard", "blindfold"];
let difficulty: DIFFICULTY = "normal";

const mainScreen = document.getElementById("mainScreen") as HTMLDivElement;

const startBtn = document.getElementById("startBtn") as HTMLDivElement;
startBtn.onclick = init;


const menuBtn = document.getElementById("menuBtn") as HTMLDivElement;
menuBtn.onclick = () => showMainScreen();

const lessDiff = document.getElementById("lessDiff") as HTMLDivElement;
lessDiff.onclick = () => changeDifficulty(-1)

const plusDiff = document.getElementById("plusDiff") as HTMLDivElement;
plusDiff.onclick = () => changeDifficulty(1)

const difficultyDiv = document.getElementById("difficulty") as HTMLDivElement;

export const gameOverScreen = document.getElementById(
  "gameOverScreen"
) as HTMLDivElement;

function showMainScreen() {
  console.log(mainScreen)
  mainScreen.style.display = "flex";
  gameOverScreen.style.display = "none";

  canvas.style.zIndex = "-100";
};

function changeDifficulty(num) {
  const currentIdx = DIFFICULTY_LIST.indexOf(difficulty);
  let newIdx = (currentIdx + num) % DIFFICULTY_LIST.length;

  if (newIdx === -1) {
    newIdx = DIFFICULTY_LIST.length - 1;
  }

  difficulty = DIFFICULTY_LIST[newIdx] as DIFFICULTY;
  difficultyDiv.innerText = difficulty;
};

player = new Player(
  new KeyboardController({
    up: "w",
    down: "s",
    left: "a",
    right: "d",
  })
);

game = new Game(player);

function init() {
  mainScreen.style.display = "none";
  canvas.style.zIndex = "100";

  game.start(difficulty);
}

// init();
