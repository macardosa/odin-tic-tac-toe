// logic for gameboard
const gameboard = (function () {
    const numberOfRows = 3;
    const grid = Array.from({ length: numberOfRows }, () => Array.from({ length: numberOfRows }, () => ""));

    function display() {
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

    function gameOver() {
        // returns symbol if there is a winner 
        switch (true) {
            case grid.flat().every(x => x === ""):
                return {status: false};

            // main diagonal
            case grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]:
                return {status: true, result: grid[0][0]};

            // secondary diagonal
            case grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]:
                return {status: true, result: grid[2][0]};
            // rows
            case grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]:
                return {status: true, result: grid[0][0]};
            case grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]:
                return {status: true, result: grid[1][0]};
            case grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]:
                return {status: true, result: grid[2][0]};

            // columns
            case grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]:
                return {status: true, result: grid[0][0]};
            case grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]:
                return {status: true, result: grid[0][1]};
            case grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]:
                return {status: true, result: grid[0][2]};

            case grid.flat().includes(""):
                return {status: false};

            default:
                return {status: true, result: "tie"};
        }
    }

    return {
        display,
        setValue,
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

// logic for game controller
const ticTacToe = (() => {
    const players = [
        new Player("player1", "X"), 
        new Player("player2", "O")
    ];
    let currentPlayerId = 0;

    function start() {
        console.log("Welcome to Tic Tac Toe}");
        currentPlayerId = Math.floor(Math.random() * 2);
        console.log(`${players[currentPlayerId].name} starts! Symbol: ${"X"}`);
    }

    function play() {
        while (gameboard.gameOver().status === false) {
            console.log(`${players[currentPlayerId].name} starts! Symbol: ${"X"}`);
        }
    }


})();
// test

gameboard.setValue(0, 0, "X");
gameboard.setValue(1, 1, "X");
gameboard.setValue(2, 2, "X");

console.log(gameboard.display());
console.log(gameboard.gameOver());
