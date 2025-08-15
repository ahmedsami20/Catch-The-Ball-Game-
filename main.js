const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const gameScore = document.getElementById("score");
const gameLives = document.getElementById("lives");

let ballX = 200;
let ballY = 0;
let ballSpeedX = Math.random() < 0.5 ? -3 : 3;
let ballSpeedY = 4;

let paddleX = 160;
let score = 0;
let lives = 3;

let keys = { ArrowLeft: false, ArrowRight: false };
let mouseControlActive = false; 

// keyboard movement
document.addEventListener("keydown", (e) => {
    if (e.key in keys) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// mouse control start and stop
const gameArea = document.getElementById("gameArea");
gameArea.addEventListener("mousedown", () => {
    mouseControlActive = true;
});
document.addEventListener("mouseup", () => {
    mouseControlActive = false;
});

// move paddle with mouse when active
document.addEventListener("mousemove", (e) => {
    if (!mouseControlActive) return;

    const rect = gameArea.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    paddleX = mouseX - paddle.offsetWidth / 2;

    // keep paddle inside game area
    if (paddleX < 0) paddleX = 0;
    if (paddleX > 320) paddleX = 320;

    paddle.style.left = paddleX + "px";
});

function movePaddle() {
    if (keys.ArrowLeft && paddleX > 0) paddleX -= 6;
    if (keys.ArrowRight && paddleX < 320) paddleX += 6;
    paddle.style.left = paddleX + "px";
}

function gameLoop() {
    movePaddle();

    // move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // bounce from left or right walls
    if (ballX <= 0 || ballX >= 380) ballSpeedX *= -1;

    // update ball position
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    // paddle collision
    if (ballY + 20 >= 480 && ballX + 20 >= paddleX && ballX <= paddleX + 80) {
        score++;
        gameScore.textContent = "Score: " + score;
        ballSpeedY *= -1;
    }

    // missed ball
    if (ballY > 500) {
        lives--;
        gameLives.textContent = "Lives: " + lives;
        if (lives <= 0) {
            alert("Game Over! Final Score: " + score);
            score = 0;
            lives = 3;
            gameScore.textContent = "Score: " + score;
            gameLives.textContent = "Lives: " + lives;
        }
        resetBall();
    }

    // bounce from top
    if (ballY <= 0) {
        ballSpeedY = Math.abs(ballSpeedY); // Always go downward after hitting top
    }

    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ballX = Math.floor(Math.random() * 380);
    ballY = 0;
    ballSpeedX = Math.random() < 0.5 ? -3 : 3;
    ballSpeedY = 4; 
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

// start game
resetBall();
gameLoop();