const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 600;
canvas.height = 400;

// Loo Osta nupp
const buyButton = document.createElement("button");
buyButton.textContent = "Osta";
buyButton.onclick = buyStock;
buyButton.style.backgroundColor = "green";
buyButton.style.color = "white";
buyButton.style.border = "none";
buyButton.style.padding = "10px 20px";
buyButton.style.fontSize = "16px";
buyButton.style.marginRight = "10px";
document.body.appendChild(buyButton);

// Loo Müü nupp
const sellButton = document.createElement("button");
sellButton.textContent = "Müü";
sellButton.onclick = sellStock;
sellButton.style.backgroundColor = "red";
sellButton.style.color = "white";
sellButton.style.border = "none";
sellButton.style.padding = "10px 20px";
sellButton.style.fontSize = "16px";
document.body.appendChild(sellButton);

// Mängumuutujad
let stockPrice = 100;
let money = 1000;
let boughtPrice = null;
let time = 0;
let maxTime = 500;
let prices = [];
let gameOver = false;

// Trumpi pildi muutujad
const trumpImage1 = new Image();
trumpImage1.src = "trump1.png";

const trumpImage2 = new Image();
trumpImage2.src = "trump2.png";

let currentTrumpImage = trumpImage1;

let showTrump = false;
let trumpTimer = 0;

function updateStockPrice() {
    if (gameOver) return;

    let changePercent;

    if (Math.random() < 0.1) {
        // 10% tõenäosusega suur Trumpi sündmus
        changePercent = Math.random() < 0.5
            ? -(Math.random() * 40 + 10)  // -10% kuni -50%
            : Math.random() * 40 + 10;    // +10% kuni +50%
        
        // ⬇️ Valime juhusliku pildi
        currentTrumpImage = Math.random() < 0.5 ? trumpImage1 : trumpImage2;   
           
        showTrump = true;
        trumpTimer = 2; // 1 kaadrit 

        prices.push(stockPrice);
        if (prices.length > 50) prices.shift();

    } else {
        // Tavaline hinnaliikumine
        changePercent = (Math.random() - 0.5) * 10;
    }

    stockPrice += stockPrice * (changePercent / 100);
    if (stockPrice < 1) stockPrice = 1;

    prices.push(stockPrice);
    if (prices.length > 50) prices.shift();

    time++;
    if (time >= maxTime || money <= 0) endGame();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Graafik
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - prices[0]);
    for (let i = 1; i < prices.length; i++) {
        ctx.lineTo(i * (canvas.width / 50), canvas.height - prices[i]);
    }
    ctx.stroke();

    // Tekst
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Raha: $${money.toFixed(2)}`, 10, 20);
    ctx.fillText(`Hind: $${stockPrice.toFixed(2)}`, 10, 40);
    ctx.fillText(`Aeg: ${time} / ${maxTime}`, 10, 60);
    if (boughtPrice !== null) {
        ctx.fillText(`Ostetud: $${boughtPrice.toFixed(2)}`, 10, 80);
    }

    // Näita Trumpi
    if (showTrump && trumpTimer > 0) {
        const size = 200;
        ctx.drawImage(currentTrumpImage, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
        trumpTimer--;
        if (trumpTimer === 0) showTrump = false;
    }

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Mäng läbi!", canvas.width / 2 - 70, canvas.height / 2);
    }
}

function buyStock() {
    if (!gameOver && boughtPrice === null) {
        boughtPrice = stockPrice;
    }
}

function sellStock() {
    if (!gameOver && boughtPrice !== null) {
        money += stockPrice - boughtPrice;
        boughtPrice = null;
    }
}

function endGame() {
    gameOver = true;
}

function gameLoop() {
    updateStockPrice();
    draw();
    if (!gameOver) setTimeout(gameLoop, 500); // aeglasem tempo
}

gameLoop();
