const board = document.getElementById("game-board");
const movesText = document.getElementById("moves");
const highScoresText = document.getElementById("high-scores");
const startBtn = document.getElementById("start-btn");
const themeSelect = document.getElementById("theme-select");
const playerCountSelect = document.getElementById("player-count");
const turnText = document.getElementById("turn");

const themes = {
  fruits: ['🍎','🍌','🍓','🍇','🍍','🥝','🍑','🍒'],
  animals: ['🐶','🐱','🐭','🐰','🦊','🐻','🐼','🐨'],
  shapes: ['🔴','🔺','🔵','⬛','⬜','🔶','🔷','🔳']
};

let cards = [];
let flipped = [];
let matched = [];
let moves = 0;
let highScores = [Infinity, Infinity];
let currentPlayer = 0;
let playerCount = 1;

startBtn.addEventListener("click", startGame);

function startGame() {
  board.innerHTML = "";
  flipped = [];
  matched = [];
  moves = 0;
  currentPlayer = 0;
  playerCount = parseInt(playerCountSelect.value);
  updateMoves();
  updateTurn();

  const theme = themeSelect.value;
  const icons = themes[theme];
  cards = [...icons, ...icons].sort(() => 0.5 - Math.random());

  cards.forEach((icon, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.dataset.index = index;
    board.appendChild(card);

    card.addEventListener("click", () => handleCardClick(card));
  });
}

function handleCardClick(card) {
  if (flipped.length >= 2 || card.classList.contains("flipped") || matched.includes(card)) return;

  card.classList.add("flipped");
  card.setAttribute("data-icon", card.dataset.icon);
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    updateMoves();

    const [card1, card2] = flipped;
    if (card1.dataset.icon === card2.dataset.icon) {
      matched.push(card1, card2);
      flipped = [];
      if (matched.length === cards.length) {
        updateHighScore();
        setTimeout(() => alert(`🎉 Player ${currentPlayer + 1} matched all cards!`), 300);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.removeAttribute("data-icon");
        card2.removeAttribute("data-icon");
        flipped = [];
        currentPlayer = (currentPlayer + 1) % playerCount;
        updateTurn();
      }, 800);
    }
  }
}

function updateMoves() {
  movesText.textContent = `Moves: ${moves}`;
}

function updateTurn() {
  if (playerCount > 1) {
    turnText.textContent = `Current Turn: Player ${currentPlayer + 1}`;
  } else {
    turnText.textContent = "Single Player Mode";
  }
}

function updateHighScore() {
  if (moves < highScores[currentPlayer]) {
    highScores[currentPlayer] = moves;
  }
  let scores = "";
  for (let i = 0; i < playerCount; i++) {
    scores += `Player ${i + 1} High Score: ${highScores[i]} moves\\n`;
  }
  highScoresText.textContent = scores;
}
