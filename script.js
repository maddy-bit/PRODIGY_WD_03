let board = Array(9).fill(null);
let currentPlayer = 'X';
let isGameOver = false;
let gameMode = 'pvp'; 

const winningCombos = [
  [0, 1, 2], 
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], 
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], 
  [2, 4, 6]
];

const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');

boardDiv.addEventListener('click', handleClick);

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!index || board[index] || isGameOver) return;

  makeMove(index, currentPlayer);

  if (checkWin(currentPlayer)) {
    statusDiv.textContent = `${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (!board.includes(null)) {
    statusDiv.textContent = 'Draw!';
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDiv.textContent = `Turn: ${currentPlayer}`;

  if (gameMode === 'ai' && currentPlayer === 'O' && !isGameOver) {
    setTimeout(aiMove, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add(player.toLowerCase()); 
}

function checkWin(player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function aiMove() {
  let emptyIndexes = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
  let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  makeMove(randomIndex, 'O');

  if (checkWin('O')) {
    statusDiv.textContent = 'O wins!';
    isGameOver = true;
    return;
  }

  if (!board.includes(null)) {
    statusDiv.textContent = 'Draw!';
    isGameOver = true;
    return;
  }

  currentPlayer = 'X';
  statusDiv.textContent = `Turn: ${currentPlayer}`;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  isGameOver = false;
  statusDiv.textContent = 'Turn: X';
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
}

function setMode(mode) {
  gameMode = mode;
  resetGame();

  const buttons = document.querySelectorAll('#modeToggle button');
  buttons.forEach(btn => btn.classList.remove('selected'));

  const selectedButton = document.querySelector(`#modeToggle button[onclick="setMode('${mode}')"]`);
  if (selectedButton) selectedButton.classList.add('selected');
}
