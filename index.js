const cells = document.querySelectorAll('.cell');
const player1ScoreSpan = document.querySelector('.player1Score');
const player2ScoreSpan = document.querySelector('.player2Score');
const restartBtn = document.querySelector('.restart');
const historyList = document.querySelector('.historyList');
const historyBtn = document.querySelector('.historyBtn');
const gameHistory = document.querySelector('.gameHistory');
const drawGamesSpan = document.querySelector('.drawGames');
const clearHistoryBtn = document.querySelector('.clearHistoryBtn');
const changeNamesBtn = document.querySelector('.changeNamesBtn');

let player1Name = prompt("Enter Player 1 name:") || "Player 1";
let player2Name = prompt("Enter Player 2 name:") || "Player 2";

let player1Moves = [];
let player2Moves = [];
let score = {
    player1: 0,
    player2: 0,
};
let isPlayer1Turn = true;
let gameOver = false;
let totalMoves = 0;
let drawCount = 0;
let gameStartTime = null;
let gameDuration = 0;

// Load game history from localStorage
let gameHistoryData = JSON.parse(localStorage.getItem('gameHistory')) || [];

// Initialize score display
drawScore();
displayGameHistory();

// Start the game
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
    // Add hover effect to cells
    cell.addEventListener('mouseover', handleHover);
    cell.addEventListener('mouseout', removeHover);
});

// Function to handle a cell click
function handleCellClick(event) {
    if (gameOver) return;

    const clickedCell = event.target;

    // Avoid clicking an already filled cell
    if (clickedCell.textContent !== '') return;

    // Start the timer on the first move
    if (!gameStartTime) {
        gameStartTime = Date.now(); // Start the timer
    }

    // Add X or O to the clicked cell
    if (isPlayer1Turn) {
        clickedCell.textContent = 'X';
        clickedCell.style.color = 'red';  // X in red
        player1Moves.push(clickedCell);
    } else {
        clickedCell.textContent = 'O';
        clickedCell.style.color = 'blue';  // O in blue
        player2Moves.push(clickedCell);
    }

    // Save the current player before toggling the turn
    const currentPlayer = isPlayer1Turn ? player1Name : player2Name;

    // Check if the current player has won
    if (checkWin()) {
        score[isPlayer1Turn ? 'player1' : 'player2']++;
        gameOver = true;
        gameDuration = (Date.now() - gameStartTime) / 1000; // Time in seconds

        // Correct the winner notification by using the saved current player
        setTimeout(() => {
            alert(`${currentPlayer} wins!`);
        }, 100);
        saveGameHistory();
    } else if (totalMoves === 8) {  // Draw condition (after the last move)
        gameOver = true;
        drawCount++;
        gameDuration = (Date.now() - gameStartTime) / 1000; // Time in seconds
        setTimeout(() => alert('It\'s a Draw!'), 100);  // Draw alert
        saveGameHistory();
    }

    totalMoves++;
    isPlayer1Turn = !isPlayer1Turn; // Toggle turn for next round
    drawScore();
}

// Function to check if a player has won
function checkWin() {
    const moves = isPlayer1Turn ? player1Moves : player2Moves;
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => 
        combination.every(index => moves.includes(cells[index]))
    );
}

// Function to update the score display
function drawScore() {
    player1ScoreSpan.textContent = `${player1Name}: ${score.player1}`;
    player2ScoreSpan.textContent = `${player2Name}: ${score.player2}`;
    drawGamesSpan.textContent = `Total Draws: ${drawCount}`;
}

// Function to save game history
function saveGameHistory() {
    const gameResult = {
        winner: isPlayer1Turn ? player1Name : player2Name,
        duration: gameDuration.toFixed(2), // Save the game duration in seconds
        draw: totalMoves === 8
    };
    gameHistoryData.push(gameResult);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistoryData));
    displayGameHistory();
}

// Function to display game history
function displayGameHistory() {
    historyList.innerHTML = '';
    gameHistoryData.forEach((game, index) => {
        const historyItem = document.createElement('li');
        historyItem.textContent = `Game ${index + 1}: ${game.winner} - Duration: ${game.duration}s - ${game.draw ? 'Draw' : 'Winner'}`;
        historyList.appendChild(historyItem);
    });
}

// Button to show/hide game history
historyBtn.addEventListener('click', () => {
    gameHistory.style.display = gameHistory.style.display === 'none' ? 'block' : 'none';
});

// Button to clear game history or both game history and scores
let clickCount = 0;
clearHistoryBtn.addEventListener('click', () => {
    clickCount++; // Increment click count on every click

    setTimeout(() => {
        if (clickCount === 1) {
            // Single click: Clear only game history
            gameHistoryData = [];
            localStorage.setItem('gameHistory', JSON.stringify(gameHistoryData));
            displayGameHistory();
            alert("Game history cleared.");
        } else if (clickCount === 2) {
            // Double click: Clear both game history and scores
            gameHistoryData = [];
            score = { player1: 0, player2: 0 };
            drawCount = 0;
            localStorage.setItem('gameHistory', JSON.stringify(gameHistoryData));
            displayGameHistory();
            drawScore(); // Update score display after clearing scores
            alert("Game history and scores cleared.");
        }

        // Reset click count after timeout
        clickCount = 0;
    }, 300); // Timeout to detect double click within 300ms
});

// Button to change player names
changeNamesBtn.addEventListener('click', () => {
    player1Name = prompt("Enter Player 1 name:") || player1Name;
    player2Name = prompt("Enter Player 2 name:") || player2Name;
    drawScore();
    alert(`Player names have been changed to:\nPlayer 1: ${player1Name}\nPlayer 2: ${player2Name}`);
});

// Restart the game
restartBtn.addEventListener('click', () => {
    resetGame();
    drawScore();
});

// Function to reset the game
function resetGame() {
    cells.forEach(cell => cell.textContent = ''); // Clear the board
    player1Moves = [];
    player2Moves = [];
    isPlayer1Turn = true;
    gameOver = false;
    totalMoves = 0;
    gameStartTime = null;
    gameDuration = 0;
}

// Get the "Clear History" button element
const clearHistoryButton = document.getElementById("clearHistoryButton");

// Variables to store the history and scores (adjust these based on your actual variables)
let GameHistory = [];
let player1Score = 0;
let player2Score = 0;

// Function to clear game history
function clearGameHistory() {
    // Show confirmation dialog before clearing
    const confirmClear = window.confirm("Are you sure you want to clear the game history?");
    if (confirmClear) {
        gameHistory = [];  // Clear the game history
        // Update your UI to reflect the cleared history
        document.getElementById("gameHistoryDisplay").innerText = "No history available"; // Example
        console.log("Game history cleared");
    } else {
        console.log("Game history not cleared");
    }
}

// Function to clear game history and player scores
function clearAllData() {
    // Show confirmation dialog before clearing
    const confirmClearAll = window.confirm("Are you sure you want to clear the game history and player scores?");
    if (confirmClearAll) {
        gameHistory = [];  // Clear the game history
        player1Score = 0;  // Reset player 1 score
        player2Score = 0;  // Reset player 2 score
        // Update your UI to reflect the cleared data
        document.getElementById("gameHistoryDisplay").innerText = "No history available"; // Example
        document.getElementById("player1Score").innerText = "Player 1: 0"; // Example
        document.getElementById("player2Score").innerText = "Player 2: 0"; // Example
        console.log("Game history and player scores cleared");
    } else {
        console.log("Game history and player scores not cleared");
    }
}

// Flag to detect double click
let clickTimeout = null;

// Add event listener for the clear history button
clearHistoryButton.addEventListener("click", function (e) {
    // Check if it's a double click or single click
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        clearAllData();  // Double-click: Show confirmation to clear history and scores
    } else {
        clickTimeout = setTimeout(function () {
            clearGameHistory();  // Single-click: Show confirmation to clear only history
        }, 300); // Delay in ms for detecting double-click
    }
});


// Hover effect for cells
function handleHover(event) {
    const cell = event.target;
    if (isPlayer1Turn) {
        cell.classList.add('x-hover');
    } else {
        cell.classList.add('o-hover');
    }
}

// Remove hover effect
function removeHover(event) {
    const cell = event.target;
    cell.classList.remove('x-hover');
    cell.classList.remove('o-hover');
}