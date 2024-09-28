let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 600;
canvas.height = 400;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
let ballRadius = 10;

// Paddle properties
let paddleHeight = 100;
let paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let paddleSpeed = 5;

// Score
let score = 0;
let gamePaused = false;
let gameOver = false;
let ballDirectionX = 1;
let ballDirectionY = 1;

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// Draw the paddles
function drawPaddles() {
    // Left Paddle
    ctx.fillStyle = "gray";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    
    // Right Paddle
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

// Move the ball and handle collisions
function updateBall() {
    if (gamePaused || gameOver) return;

    ballX += ballSpeedX * ballDirectionX;
    ballY += ballSpeedY * ballDirectionY;

    // Bounce off top and bottom
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballDirectionY = -ballDirectionY;
    }

    // Bounce off paddles or game over
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballDirectionX = -ballDirectionX;
        updateScore();
    } else if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballDirectionX = -ballDirectionX;
        updateScore();
    } else if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        endGame();  // End game if the ball misses the paddles
    }
}

// Move paddles based on mouse clicks
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;
    
    if (mouseY > paddleHeight / 2 && mouseY < canvas.height - paddleHeight / 2) {
        leftPaddleY = mouseY - paddleHeight / 2;
        rightPaddleY = mouseY - paddleHeight / 2;
    }
});

// Update score
function updateScore() {
    fetch('/hit', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            score = data.score;
            document.getElementById("score").innerText = score;
        });
}

// Game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    updateBall();
    requestAnimationFrame(draw);
}

// Game controls
function startGame() {
    gamePaused = false;
    gameOver = false;
    document.getElementById("game-over-message").innerText = "";
    let difficulty = document.getElementById("difficulty").value;
    fetch('/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: difficulty })
    })
    .then(response => response.json())
    .then(() => {
        ballDirectionX = 1;
        ballDirectionY = 1;
        draw();
    });
}

function pauseGame() {
    gamePaused = true;
}

function resetGame() {
    if (!gameOver) {
        gamePaused = true;
        gameOver = false;
        fetch('/reset', { method: 'POST' })
            .then(response => response.json())
            .then(() => {
                score = 0;
                document.getElementById("score").innerText = score;
                document.getElementById("game-over-message").innerText = "";
                gamePaused = false;
            });
    }
}

function endGame() {
    gamePaused = true;
    gameOver = true;
    fetch('/end', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById("game-over-message").innerText = `Game Over! Your Score: ${data.score}. Press Start to play again.`;
        });
}
