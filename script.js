const board = document.getElementById("board");
const info = document.getElementById("info");

let cells = [];
let currentPlayer = "X";
let gameActive = true;

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", onCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }

  info.textContent = "Your turn (X)";
  gameActive = true;
}

function onCellClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== "") return;

  cell.textContent = currentPlayer;
  if (checkWinner(currentPlayer)) {
    info.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    info.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  info.textContent = "Computer's turn (O)";
  setTimeout(computerMove, 500);
}

function computerMove() {
  const bestMove = getBestMove();
  cells[bestMove].textContent = "O";

  if (checkWinner("O")) {
    info.textContent = "Computer wins! 😢";
    gameActive = false;
    return;
  }

  if (isDraw()) {
    info.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  info.textContent = "Your turn (X)";
}

function getBestMove() {
  const emptyIndices = cells
    .map((cell, index) => (cell.textContent === "" ? index : null))
    .filter(index => index !== null);

  // Check if AI can win in next move
  for (let index of emptyIndices) {
    cells[index].textContent = "O";
    if (checkWinner("O")) {
      cells[index].textContent = "";
      return index;
    }
    cells[index].textContent = "";
  }

  // Block if player can win in next move
  for (let index of emptyIndices) {
    cells[index].textContent = "X";
    if (checkWinner("X")) {
      cells[index].textContent = "";
      return index;
    }
    cells[index].textContent = "";
  }

  // Take center if available
  if (emptyIndices.includes(4)) return 4;

  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => emptyIndices.includes(i));
  if (availableCorners.length > 0) return availableCorners[0];

  // Take any empty
  return emptyIndices[0];
}

function checkWinner(player) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winCombos.some(combo => 
    combo.every(index => cells[index].textContent === player)
  );
}

function isDraw() {
  return cells.every(cell => cell.textContent !== "");
}

function resetGame() {
  currentPlayer = "X";
  createBoard();
}

createBoard();
