let menuScreen = document.getElementById('menuScreen');
let gameScreen = document.getElementById('gameScreen');

let resultText = document.getElementById('resultText');
let winCountText = document.getElementById('winCount');
let loseCountText = document.getElementById('loseCount');

let player = document.getElementById('player');
let obstaclesContainer = document.getElementById('obstacles');

let x = 6;

let minX = 5;
let maxX = 78;

let direction = 1;
let timer;
let isJumping = false;
let gameActive = false;

let wins = 0;
let loses = 0;

let obstacles = [];

function setPlayerImage(image, heightPercent) {
    player.src = image;
    player.style.height = heightPercent + '%';
}

function updateStats() {
    winCountText.textContent = wins;
    loseCountText.textContent = loses;
}

function showMenu(message) {
    gameActive = false;

    gameScreen.style.display = 'none';
    menuScreen.style.display = 'block';

    resultText.textContent = message;

    updateStats();
}

function startGame() {
    gameActive = true;

    x = 6;
    direction = 1;
    isJumping = false;

    player.style.left = x + '%';
    player.style.bottom = '20%';
    player.style.transform = 'scaleX(1)';

    setPlayerImage('GirlStay.png', 28);

    generateObstacles();

    menuScreen.style.display = 'none';
    gameScreen.style.display = 'block';
}

function endGame(isWin) {
    if (isWin) {
        wins = wins + 1;
        showMenu('Вы выиграли! Защищённая зона достигнута.');
    } else {
        loses = loses + 1;
        showMenu('Вы проиграли! Персонаж попал на заражённый участок сети.');
    }
}

function moveLeft() {
    if (gameActive && x > minX && !isJumping) {
        direction = -1;

        x = x - 2;

        player.style.left = x + '%';
        player.style.transform = 'scaleX(-1)';

        setPlayerImage('GirlGo.png', 26);

        clearTimeout(timer);

        timer = setTimeout(function () {
            setPlayerImage('GirlStay.png', 28);
        }, 200);

        checkCollision();
    }
}

function moveRight() {
    if (gameActive && x < maxX && !isJumping) {
        direction = 1;

        x = x + 2;

        player.style.left = x + '%';
        player.style.transform = 'scaleX(1)';

        setPlayerImage('GirlGo.png', 26);

        clearTimeout(timer);

        timer = setTimeout(function () {
            setPlayerImage('GirlStay.png', 28);
        }, 200);

        checkCollision();
        checkWin();
    }
}

function jump() {
    if (gameActive && !isJumping) {
        isJumping = true;

        setPlayerImage('GirlJump.png', 25);

        player.style.bottom = '30%';

        setTimeout(function () {
            x = x + 14 * direction;

            if (x < minX) {
                x = minX;
            }

            if (x > maxX) {
                x = maxX;
            }

            player.style.left = x + '%';
        }, 150);

        setTimeout(function () {
            player.style.bottom = '20%';
        }, 300);

        setTimeout(function () {
            setPlayerImage('GirlStay.png', 28);

            isJumping = false;

            checkCollision();
            checkWin();
        }, 550);
    }
}

function generateObstacles() {
    obstaclesContainer.innerHTML = '';
    obstacles = [];

    let positions = [24, 32, 40, 48, 56, 64, 72];
    let selectedIndexes = [];

    while (selectedIndexes.length < 3) {
        let randomIndex = Math.floor(Math.random() * positions.length);

        let canAdd = true;

        for (let i = 0; i < selectedIndexes.length; i++) {
            if (
                selectedIndexes[i] == randomIndex ||
                Math.abs(selectedIndexes[i] - randomIndex) == 1
            ) {
                canAdd = false;
            }
        }

        if (canAdd) {
            selectedIndexes.push(randomIndex);
        }
    }

    for (let i = 0; i < selectedIndexes.length; i++) {
        let lava = document.createElement('div');

        lava.className = 'danger-block';
        lava.style.left = positions[selectedIndexes[i]] + '%';

        obstaclesContainer.appendChild(lava);
        obstacles.push(positions[selectedIndexes[i]]);
    }
}

function checkCollision() {
    if (!gameActive || isJumping) {
        return;
    }

    for (let i = 0; i < obstacles.length; i++) {
        if (Math.abs(x - obstacles[i]) < 5) {
            endGame(false);
        }
    }
}

function checkWin() {
    if (gameActive && x >= maxX) {
        endGame(true);
    }
}

updateStats();
