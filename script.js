// ==============================
// Background music dan bunyi efek
// ==============================
const bgMusic = new Audio('audio/game.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

const keySound = new Audio('audio/key-press.mp3');
const gameOverSound = new Audio('audio/game-over.mp3'); // NEW audio untuk game over

// bunyi efek bila tekan key
document.addEventListener('keydown', () => {
    keySound.currentTime = 0;
    keySound.play();
});

// ==============================
// Element DOM
// ==============================
const desktop = document.getElementById('desktop');
const mainInput = document.getElementById('main-input');
const stressFill = document.getElementById('stress-fill');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');

let emails = [];
let score = 0;
let stress = 0;
let gameActive = false;

const wordBank = ["ACCESS", "BYPASS", "UPLOAD", "DELETE", "SOURCE", "SYSTEM", "REBOOT", "CONFIG", "SIGNAL", "ENCRYPT", "PORTAL", "KERNEL"];

// ==============================
// Game Functions
// ==============================
function startGame() {
    overlay.style.display = 'none';
    gameActive = true;
    score = 0;
    stress = 0;
    emails = [];
    desktop.innerHTML = '';
    scoreEl.innerText = score;
    mainInput.focus();

    bgMusic.play(); // start music bila game start

    spawnEmail();
    gameLoop();
}

function spawnEmail() {
    if (!gameActive) return;

    const id = Date.now();
    const subject = wordBank[Math.floor(Math.random() * wordBank.length)];
    
    const card = document.createElement('div');
    card.className = 'email-card';
    card.id = `win-${id}`;
    
    const x = Math.random() * (window.innerWidth - 250) + 20;
    const y = Math.random() * (window.innerHeight - 300) + 80;
    card.style.left = x + 'px';
    card.style.top = y + 'px';

    card.innerHTML = `
        <div class="card-header">
            <span>INCOMING_TASK_${id % 999}</span>
            <span style="color:var(--neon-pink, #FF00FF)">●</span>
        </div>
        <div class="card-body">
            <div class="word-target">${subject}</div>
        </div>
    `;

    desktop.appendChild(card);
    emails.push({ id: id, subject: subject, el: card });

    updateStress(4);

    let nextSpawn = Math.max(400, 1500 - (score * 15));
    setTimeout(spawnEmail, nextSpawn);
}

function updateStress(amount) {
    stress += amount;
    if (stress > 100) stress = 100;
    if (stress < 0) stress = 0;
    stressFill.style.width = stress + '%';

    if (stress >= 100) gameOver();
}

function gameLoop() {
    if (!gameActive) return;
    
    if (emails.length > 5) {
        updateStress(0.05);
    }

    requestAnimationFrame(gameLoop);
}

// Input event
mainInput.addEventListener('input', () => {
    const val = mainInput.value.toUpperCase().trim();
    const index = emails.findIndex(e => e.subject === val);

    if (index !== -1) {
        const email = emails[index];
        
        email.el.style.boxShadow = "0 0 50px #0ff";
        email.el.style.transform = "scale(1.1) rotate(5deg)";
        email.el.style.opacity = "0";
        
        setTimeout(() => email.el.remove(), 200);
        emails.splice(index, 1);
        
        score++;
        scoreEl.innerText = score;
        updateStress(-6); 
        mainInput.value = '';
    }
});

function gameOver() {
    gameActive = false;

    // pause background music & play game over sound
    bgMusic.pause();
    gameOverSound.play();

    // delay overlay muncul 1.5 saat supaya audio dengar dulu
    setTimeout(() => {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <h1 style="background: #FF00FF; -webkit-background-clip: text;">SYSTEM CRASH</h1>
            <p style="color: white; margin-top: 20px;">BRAIN OVERLOAD AT ${score} TASKS.</p>
            <button onclick="location.reload()">REBOOT SYSTEM</button>
        `;
    }, 1500); // 1.5s timeout
}