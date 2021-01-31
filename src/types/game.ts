type DIFFICULTY = "easy" | "normal" | "hard" | "blindfold";

type Maze = Array<Array<0 | 1 | 2 | 3>>;

interface iGame {
  player: iPlayer;
  difficulty: DIFFICULTY;
}
