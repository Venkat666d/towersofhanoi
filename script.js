let draggedDisk = null;
let moveCount = 0;
let numDisks = 3;
let timer;
let startTime;
let selectedPeg = 1;

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("splash-screen").style.display = "none";
        document.getElementById("rules-screen").style.display = "block";
    }, 2000);
});

function showLevelSelection() {
    document.getElementById("rules-screen").style.display = "none";
    document.getElementById("level-selection").style.display = "block";
    document.getElementById("restartBtn").style.display = "none";
}

function startGame(disks) {
    numDisks = disks;
    document.getElementById("level-selection").style.display = "none";
    document.getElementById("game").style.display = "flex";
    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("result-screen").style.display = "none";

    setupGame();
    startTimer();
}

function setupGame() {
    moveCount = 0;
    document.getElementById("moveCount").textContent = moveCount;
    document.getElementById("timer").textContent = "0s";

    let colors = ["#ff4757", "#ff6b6b", "#ff9f43", "#feca57", "#48dbfb", "#1dd1a1", "#ff7f50", "#b33939", "#cd6133", "#786fa6"];

    document.getElementById("peg1").innerHTML = "";
    document.getElementById("peg2").innerHTML = "";
    document.getElementById("peg3").innerHTML = "";

    for (let i = numDisks; i > 0; i--) {
        let disk = document.createElement("div");
        disk.classList.add("disk");
        disk.style.width = `${40 + i * 15}px`;
        disk.style.backgroundColor = colors[i - 1];
        disk.dataset.size = i;
        document.getElementById("peg1").appendChild(disk);

        disk.addEventListener("dragstart", dragStart);
        disk.addEventListener("touchstart", touchStart);
    }

    document.querySelectorAll(".peg").forEach(peg => {
        peg.addEventListener("dragover", dragOver);
        peg.addEventListener("drop", drop);
        peg.addEventListener("touchend", touchEnd);
    });

    selectedPeg = 1; // Reset selected peg for keyboard control
}

function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        let elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").textContent = elapsed + "s";
    }, 1000);
}

// Mouse and Drag Controls
function dragStart(event) {
    let peg = event.target.parentElement;
    let topDisk = peg.lastElementChild;
    if (event.target !== topDisk) return;
    draggedDisk = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    let peg = event.target.closest(".peg");
    if (!peg) return;
    moveDisk(peg);
}

// Touch Controls
function touchStart(event) {
    let peg = event.target.parentElement;
    let topDisk = peg.lastElementChild;
    if (event.target !== topDisk) return;
    draggedDisk = event.target;
}

function touchEnd(event) {
    let peg = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY).closest(".peg");
    if (!peg) return;
    moveDisk(peg);
}

// Keyboard Controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        selectedPeg = selectedPeg === 1 ? 3 : selectedPeg - 1;
    } else if (event.key === "ArrowRight") {
        selectedPeg = selectedPeg === 3 ? 1 : selectedPeg + 1;
    } else if (event.key === "Enter") {
        let peg = document.getElementById(`peg${selectedPeg}`);
        if (!draggedDisk) {
            // Pick up disk
            draggedDisk = peg.lastElementChild;
        } else {
            // Drop disk
            moveDisk(peg);
        }
    }
});

function moveDisk(peg) {
    if (!draggedDisk) return;

    let topDisk = peg.lastElementChild;
    if (!topDisk || parseInt(draggedDisk.dataset.size) < parseInt(topDisk.dataset.size)) {
        peg.appendChild(draggedDisk);
        moveCount++;
        document.getElementById("moveCount").textContent = moveCount;

        if (document.getElementById("peg3").childElementCount === numDisks) {
            clearInterval(timer);
            displayResult();
        }
    }
    draggedDisk = null;
}

function displayResult() {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);

    document.getElementById("bestMoves").textContent = `Moves: ${moveCount}`;
    document.getElementById("bestTime").textContent = `Time: ${elapsed}s`;

    document.getElementById("result-screen").style.display = "block";
}

function replayGame() {
    document.getElementById("result-screen").style.display = "none";
    startGame(numDisks);
}

function selectAnotherLevel() {
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("level-selection").style.display = "block";
}
