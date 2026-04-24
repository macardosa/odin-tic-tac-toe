// logic for gameboard
const gameboard = (function () {
    const numberOfRows = 3;
    const grid = Array.from({ length: numberOfRows }, () => Array.from({ length: numberOfRows }, () => ""));

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
            case grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]:
                return { status: true, result: grid[0][0] };

            // secondary diagonal
            case grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]:
                return { status: true, result: grid[2][0] };
            // rows
            case grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]:
                return { status: true, result: grid[0][0] };
            case grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]:
                return { status: true, result: grid[1][0] };
            case grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]:
                return { status: true, result: grid[2][0] };

            // columns
            case grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]:
                return { status: true, result: grid[0][0] };
            case grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]:
                return { status: true, result: grid[0][1] };
            case grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]:
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
        gameOver
    }
})();

// players
function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.score = 0;
}

Player.prototype.play = function () {
    const [row, col] = prompt(`${this.name}: `).split(/\s+/);
    return { row, col };
}

Player.prototype.getSymbol = function() {
    return this.symbol;
}

// logic for game controller
const ticTacToe = (() => {
    const players = [
        new Player("player1", "X"),
        new Player("player2", "O"),
    ];
    let currentPlayerId = 0;
    let nextPlayerId = 1;

    // display/DOM logic
    const DOM = (function () {
        const board = document.querySelector(".game-board");
        const statusBox = document.querySelector(".status-box");

        function displayGrid() {
            Array.from(board.children).forEach((child, index) => {
                const [i, j] = [index % 3, Math.floor(index / 3)];
                child.textContent = gameboard.getValue(i, j);
            });
        }

        board.addEventListener("click", (e) => {
            const symbol = players[currentPlayerId].getSymbol();
            const cell = e.target;
            if (cell.textContent === "") {
                cell.textContent = symbol;
                const [i, j] = cell.id.slice(-3).split("-").map(x => Number(x));
                gameboard.setValue(i, j, symbol);
            }
        });

        function setCurrentPlayer(name) {
            statusBox.textContent = `Turn: ${name}`;
        }

        return {
            displayGrid,
            setCurrentPlayer,
        }

    })();

    function start() {
        console.log("Welcome to Tic Tac Toe");
        currentPlayerId = Math.floor(Math.random() * 2);
        DOM.displayGrid();
        DOM.setCurrentPlayer(players[currentPlayerId].name);
    }

    function play() {
        nextPlayerId = (currentPlayerId === 0) ? 1 : 0;
        while (gameboard.gameOver().status === false) {
            currentPlayerId = nextPlayerId;
            console.log("hello");
        }
    }

    return {
        start,
        play
    }

})();

// test
gameboard.setValue(0, 0, "X");
gameboard.setValue(1, 1, "X");
gameboard.setValue(2, 2, "X");

ticTacToe.start();
ticTacToe.play();