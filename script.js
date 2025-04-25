const words = ["SAVINGS", "TAX", "ASSET", "LIABILITY", "BALANCE", "SUPPLY", "DEMAND", "INFLATION", "GUARANTEE", "CLAIM"];
        const gridSize = 10;
        let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(""));
        const gridElement = document.getElementById("word-search-grid");
        let selectedCells = [];
        let foundWords = new Set();

        // Fill the grid with random letters and place words
        function initializeGrid() {
            // Place words
            const directions = [[0, 1], [1, 0], [1, 1]]; // Right, Down, Diagonal
            words.forEach(word => {
                let placed = false;
                while (!placed) {
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    const row = Math.floor(Math.random() * gridSize);
                    const col = Math.floor(Math.random() * gridSize);
                    if (canPlaceWord(word, row, col, dir)) {
                        placeWord(word, row, col, dir);
                        placed = true;
                    }
                }
            });

            // Fill remaining spaces with random letters
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (!grid[i][j]) {
                        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    }
                }
            }

            // Render the grid
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const cell = document.createElement("div");
                    cell.classList.add("cell");
                    cell.textContent = grid[i][j];
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.addEventListener("click", handleCellClick);
                    gridElement.appendChild(cell);
                }
            }
        }

        function canPlaceWord(word, row, col, dir) {
            for (let i = 0; i < word.length; i++) {
                const r = row + i * dir[0];
                const c = col + i * dir[1];
                if (r >= gridSize || c >= gridSize || (grid[r][c] && grid[r][c] !== word[i])) {
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
            const cell = event.target;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            selectedCells.push({ row, col });
            cell.classList.add("selected");

            const word = checkForWord();
            if (word) {
                foundWords.add(word);
                updateWordList();
                selectedCells = [];
                document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
            }
        }

        function checkForWord() {
            if (selectedCells.length < 2) return null;

            // Check if cells form a straight line (horizontal, vertical, or diagonal)
            const rows = selectedCells.map(cell => cell.row);
            const cols = selectedCells.map(cell => cell.col);
            const isHorizontal = rows.every(r => r === rows[0]);
            const isVertical = cols.every(c => c === cols[0]);
            const isDiagonal = rows[1] - rows[0] === cols[1] - cols[0] && rows.every((r, i) => r - rows[0] === i * (rows[1] - rows[0]));

            if (!(isHorizontal || isVertical || isDiagonal)) {
                selectedCells = [];
                document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
                return null;
            }

            // Sort cells by position
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

        // Initialize the game
        initializeGrid();
