// logic for gameboard
const gameboard = (function () {
    const numberOfRows = 3;
    let grid = null;

    function start() {
        grid = Array.from({ length: numberOfRows }, () => Array.from({ length: numberOfRows }, () => ""));
    }

    function toString() {
        return grid
            .map(row => row.join(" "))
            .join("\n");
    }

    function setValue(i, j, symbol) {
        if (i < 0 || i > numberOfRows - 1 || j < 0 || j > numberOfRows - 1) {
            throw Error("Indexes out of grid bounds");
        }

        if (grid[i][j] !== "") {
            throw Error(`cell ${i + 1}, ${j + 1} is filled`);
        }

        grid[i][j] = symbol;
    }

    function getNumRows() {
        return numberOfRows;
    }

    function getValue(i, j) {
        if (i < 0 || i > numberOfRows - 1 || j < 0 || j > numberOfRows - 1) {
            return null;
        }
        return grid[i][j];
    }

    function gameOver() {
        // returns symbol if there is a winner 
        switch (true) {
            case grid.flat().every(x => x === ""):
                return { status: false };

            // main diagonal
            case grid[0][0] !== "" && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]:
                return { status: true, result: grid[0][0] };

            // secondary diagonal
            case grid[2][0] !== "" && grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]:
                return { status: true, result: grid[2][0] };
            // rows
            case grid[0][0] !== "" && grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]:
                return { status: true, result: grid[0][0] };
            case grid[1][0] !== "" && grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]:
                return { status: true, result: grid[1][0] };
            case grid[2][0] !== "" && grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]:
                return { status: true, result: grid[2][0] };

            // columns
            case grid[0][0] !== "" && grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]:
                return { status: true, result: grid[0][0] };
            case grid[0][1] !== "" && grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]:
                return { status: true, result: grid[0][1] };
            case grid[0][2] !== "" && grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]:
                return { status: true, result: grid[0][2] };

            case grid.flat().includes(""):
                return { status: false };

            default:
                return { status: true, result: "tie" };
        }
    }

    return {
        toString,
        setValue,
        getValue,
        gameOver,
        start,
        getNumRows,
    }
})();

// players
function Player(name, symbol, color) {
    this.name = name;
    this.symbol = symbol;
    this.color = color;
    this.score = 0;
}

Player.prototype.increaseScore = function () {
    this.score++;
}

const players = []; // array to store players

// logic for game controller
const ticTacToe = (() => {
    let currentPlayerId = 0;
    let nextPlayerId = 1;
    let playing = false;

    // display/DOM logic
    const DOM = (function () {
        const board = document.querySelector(".game-board");
        const statusBox = document.querySelector(".status-box");
        const scoreBoxes = document.querySelectorAll(".info > :last-child");

        function displayGrid() {
            board.style.display = "grid";
            statusBox.style.display = "block";
            Array.from(board.children).forEach((child, index) => {
                const row = index % gameboard.getNumRows();
                const col = Math.floor(index / gameboard.getNumRows());
                child.textContent = gameboard.getValue(row, col);
                child.classList.remove("filled");
            });
        }

        board.addEventListener("click", (e) => {
            const symbol = players[currentPlayerId].symbol;
            const color = players[currentPlayerId].color;
            const cell = e.target;
            if (playing && cell.textContent === "") {
                const [i, j] = cell.id.slice(-3).split("-").map(x => Number(x));
                gameboard.setValue(i, j, symbol);
                cell.textContent = symbol;
                cell.style.color = color;
                cell.classList.add("filled");
                ticTacToe.play();
            }
        });

        function setDisplayMessage(message) {
            statusBox.textContent = message;
        }

        function setNewScore(winnerIndex, newScore) {
            scoreBoxes[winnerIndex].textContent = `Score: ${newScore}`;
        }

        return {
            displayGrid,
            setDisplayMessage,
            setNewScore,
        }

    })();

    function start() {
        // choose player that starts randomly
        currentPlayerId = Math.floor(Math.random() * 2);
        nextPlayerId = (currentPlayerId === 0) ? 1 : 0;

        playing = true; // start game execution
        gameboard.start();

        DOM.displayGrid();
        DOM.setDisplayMessage(`Turn: ${players[currentPlayerId].name}`);
    }

    function switchPlayers() {
        [currentPlayerId, nextPlayerId] = [nextPlayerId, currentPlayerId];
        DOM.setDisplayMessage(`Turn: ${players[currentPlayerId].name}`);
    }

    function findIndexWinner(symbol) {
        return (players[0].symbol === symbol)
            ? 0
            : 1;
    }

    function play() {
        const { status, result } = gameboard.gameOver();
        if (status) {
            if (result === "tie") {
                DOM.setDisplayMessage(`This match is a tie!`);
            } else {
                const winnerIndex = findIndexWinner(result);
                const winner = players[winnerIndex].name;
                DOM.setDisplayMessage(`${winner} wins!`);
                players[winnerIndex].increaseScore();
                DOM.setNewScore(winnerIndex, players[winnerIndex].score);
            }
            playing = false; // stop game execution
            return;
        }
        switchPlayers();
    }

    return {
        start,
        play
    }

})();

// logic to manage the application from the webpage
document.querySelector(".play-btn")
    .addEventListener("click", () => {
        ticTacToe.start();
    });

// logic to start game and get user info
const startBtn = document.querySelector(".start-btn");
const playersNamesForm = document.querySelector(".players-names");
startBtn.addEventListener("click", () => {
    playersNamesForm.style.display = "flex";
    startBtn.style.display = "none";
});

const header = document.querySelector(".header");
const startGameBtn = document.querySelector(".start-game-btn");
startGameBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // get name of players
    const player1Name = playersNamesForm.elements.name1.value;
    const player2Name = playersNamesForm.elements.name2.value;

    // assign shape and color of symbol randomly
    const randomChoiceSymbol = Math.floor(Math.random() * 2);
    const randomChoiceColor = Math.floor(Math.random() * 2);
    if (randomChoiceSymbol === 0 && randomChoiceColor === 0) {
        players.push(new Player(player1Name, "X", "black"));
        players.push(new Player(player2Name, "O", "white"));
    } else if (randomChoiceSymbol === 0 && randomChoiceColor === 1) {
        players.push(new Player(player1Name, "X", "white"));
        players.push(new Player(player2Name, "O", "black"));
    } else if (randomChoiceSymbol === 1 && randomChoiceColor === 0) {
        players.push(new Player(player1Name, "O", "black"));
        players.push(new Player(player2Name, "X", "white"));
    } else {
        players.push(new Player(player1Name, "O", "white"));
        players.push(new Player(player2Name, "X", "black"));
    }

    // render game layout
    playersNamesForm.style.display = "none";
    header.style.display = "flex";
    const symbolBoxes = header.querySelectorAll(".symbol");
    symbolBoxes[0].textContent = players[0].symbol;
    symbolBoxes[0].style.color = players[0].color;
    symbolBoxes[1].textContent = players[1].symbol;
    symbolBoxes[1].style.color = players[1].color;

    // add names of each player to the header
    const nameBoxes = document.querySelectorAll(".info > :first-child");
    nameBoxes[0].textContent = player1Name;
    nameBoxes[1].textContent = player2Name;
});

// copyright notice
document.getElementById("year").textContent = new Date().getFullYear();