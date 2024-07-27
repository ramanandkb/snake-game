const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [];
let food = {};
let score = 0;
let direction = null;
let gameInterval = null;
const maxScore = 10;

function initGame() {
    canvas.width = document.getElementById("gameContainer").offsetWidth;
    canvas.height = document.getElementById("gameContainer").offsetHeight;
    resetGame();
    document.getElementById("startScreen").style.display = "flex";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("confetti").style.display = "none";
}

function resetGame() {
    snake = [{ x: Math.floor(canvas.width / 2 / box) * box, y: Math.floor(canvas.height / 2 / box) * box }];
    food = generateFood();
    score = 0;
    direction = null;
    if (gameInterval) clearInterval(gameInterval);
    updateScoreDisplay();
    updateProgressBar();
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#ff6f61" : "#34a853";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "#282c34";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    ctx.fillStyle = "#34a853";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case "LEFT": head.x -= box; break;
        case "UP": head.y -= box; break;
        case "RIGHT": head.x += box; break;
        case "DOWN": head.y += box; break;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
        updateScoreDisplay();
        updateProgressBar();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        clearInterval(gameInterval);
        document.getElementById("score").textContent = score;
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameOverScreen").style.display = "flex";
        showConfetti();
        return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function collision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function updateScoreDisplay() {
    document.getElementById("scoreDisplay").textContent = `Score: ${score}`;
}

function updateProgressBar() {
    const progress = document.getElementById("progress");
    const progressBarWidth = (score / maxScore) * 100;
    progress.style.width = `${progressBarWidth}%`;
}

function showConfetti() {
    const confettiContainer = document.getElementById("confetti");
    confettiContainer.style.display = "block";
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement("div");
        confettiPiece.classList.add("piece");
        confettiPiece.style.left = `${Math.random() * 100}%`;
        confettiPiece.style.animationDelay = `${Math.random()}s`;
        confettiContainer.appendChild(confettiPiece);
        setTimeout(() => confettiPiece.remove(), 1000);
    }
}

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if ((key === "ArrowLeft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
    if ((key === "ArrowUp" || key === "w") && direction !== "DOWN") direction = "UP";
    if ((key === "ArrowRight" || key === "d") && direction !== "LEFT") direction = "RIGHT";
    if ((key === "ArrowDown" || key === "s") && direction !== "UP") direction = "DOWN";
});

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startScreen").classList.remove("fade-in");
    document.getElementById("startScreen").style.display = "none";
    gameInterval = setInterval(draw, 100);
});

document.getElementById("restartButton").addEventListener("click", () => {
    document.getElementById("gameOverScreen").style.display = "none";
    resetGame();
    gameInterval = setInterval(draw, 100);
});

window.onload = initGame;
window.onresize = initGame;
