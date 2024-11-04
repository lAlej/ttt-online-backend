export const detectWinner = (gameTable: string[][]) => {
  // filas y columnas
  for (let i = 0; i < 3; i++) {
    // verificar filas
    if (
      gameTable[i][0] &&
      gameTable[i][0] === gameTable[i][1] &&
      gameTable[i][0] === gameTable[i][2]
    ) {
      return gameTable[i][0];
    }
    // verificar columnas
    if (
      gameTable[0][i] &&
      gameTable[0][i] === gameTable[1][i] &&
      gameTable[0][i] === gameTable[2][i]
    ) {
      return gameTable[0][i];
    }
  }

  // diagonales
  if (
    gameTable[0][0] &&
    gameTable[0][0] === gameTable[1][1] &&
    gameTable[0][0] === gameTable[2][2]
  ) {
    return gameTable[0][0];
  }

  if (
    gameTable[0][2] &&
    gameTable[0][2] === gameTable[1][1] &&
    gameTable[0][2] === gameTable[2][0]
  ) {
    return gameTable[0][2];
  }

  // no hay ganador
  return null;
};

export function isTableEmpty(gameTable: string[][]): boolean {
  for (let row of gameTable) {
    for (let cell of row) {
      if (cell !== "") {
        return false;
      }
    }
  }
  return true;
}
