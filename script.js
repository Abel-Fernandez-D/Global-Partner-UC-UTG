const words = ["SAVINGS", "TAX", "ASSET", "LIABILITY", "BALANCE", "SUPPLY", "DEMAND", "INFLATION", "GUARANTEE", "CLAIM"];
const gridSize = 15;
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(""));
const gridElement = document.getElementById("word-search-grid");
let selectedCells = [];
let foundWords = new Set();

function initializeGrid() {
    console.log("Initializing grid...");
    const directions = [
        [0, 1],   // Right
        [1, 0],   // Down
        [1, 1],   // Diagonal down-right
        [-1, 1],  // Diagonal up-right
        [0, -1],  // Left
        [-1, 0],  // Up
        [-1, -1], // Diagonal up-left
        [1, -1]   // Diagonal down-left
    ];
    
    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (canPlaceWord(word, row, col, dir)) {
                placeWord(word, row, col, dir);
                placed = true;
            }
            attempts++;
        }
        if (!placed) console.log(`Could not place word: ${word}`);
    });

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!grid[i][j]) {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            const span = document.createElement("span");
            span.textContent = grid[i][j];
            cell.appendChild(span);
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", handleCellClick);
            gridElement.appendChild(cell);
        }
    }
    console.log("Grid initialized.");
}

function canPlaceWord(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dir[0];
        const c = col + i * dir[1];
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || (grid[r][c] && grid[r][c] !== word[i])) {
            return false;
        }
    }
    return true;
}

function placeWord(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dir[0];
        const c = col + i * dir[1];
        grid[r][c] = word[i];
    }
}

function handleCellClick(event) {
    const cell = event.target.closest(".cell");
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    selectedCells.push({ row, col });
    cell.classList.add("selected");

    const word = checkForWord();
    if (word) {
        foundWords.add(word);
        updateWordList();
        showFunFactPopup(word);  // Show pop-up when word is found
        selectedCells = [];
        document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
    }
}

function checkForWord() {
    if (selectedCells.length < 2) return null;

    const rows = selectedCells.map(cell => cell.row);
    const cols = selectedCells.map(cell => cell.col);
    const isHorizontal = rows.every(r => r === rows[0]);
    const isVertical = cols.every(c => c === cols[0]);
    const isDiagonal = rows[1] - rows[0] === cols[1] - cols[0] && rows.every((r, i) => r - rows[0] === i * (rows[1] - rows[0]));
    const isDiagonalReverse = rows[1] - rows[0] === -(cols[1] - cols[0]) && rows.every((r, i) => r - rows[0] === i * (rows[1] - rows[0]));

    if (!(isHorizontal || isVertical || isDiagonal || isDiagonalReverse)) {
        selectedCells = [];
        document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
        return null;
    }

    selectedCells.sort((a, b) => isHorizontal ? a.col - b.col : a.row - b.row);
    const word = selectedCells.map(cell => grid[cell.row][cell.col]).join("");
    const reverseWord = selectedCells.map(cell => grid[cell.row][cell.col]).reverse().join("");

    return words.includes(word) ? word : words.includes(reverseWord) ? reverseWord : null;
}

function updateWordList() {
    document.querySelectorAll("#word-list li").forEach(item => {
        const word = item.dataset.word;
        if (foundWords.has(word)) {
            item.classList.add("found");
            const fact = item.querySelector(".fact");
            fact.classList.add("visible");
        }
    });
}

function showFunFactPopup(word) {
    const factElement = document.querySelector(`#word-list li[data-word="${word}"] .fact`);
    const factText = factElement.innerHTML;
    document.getElementById('popup-text').innerHTML = factText;
    document.getElementById('popup').style.display = 'block';
}

function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: "Financial Skills for a Brighter Future",
            text: "Learn about financial education and SDG 4 with this fun word search game!",
            url: window.location.href
        });
    } else {
        alert("Sharing is not supported on this device. Copy the URL to share!");
    }
}

initializeGrid();

// Add event listener for the continue button in the pop-up
document.getElementById('continue-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});
