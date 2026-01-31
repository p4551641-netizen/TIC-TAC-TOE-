let boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const modeSelector = document.querySelector("#mode-selector");
const gameContainer = document.querySelector("#game-container");
const singlePlayerBtn = document.querySelector("#single-player-btn");
const doublePlayerBtn = document.querySelector("#double-player-btn");

let turn0 = true;
let isComputerPlayer = false;
let gameActive = true; 

const winpatterns =[
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const resetGame = () => {
    turn0 = true;
    gameActive = true;
    for (let box of boxes) {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("o", "x");
    }
    if (msg) msg.innerText = "";
    if (msgContainer) msgContainer.classList.add("hide");
}; 

const startModeSelector = () => {
    modeSelector.classList.remove("hide");
    gameContainer.classList.add("hide");
    if (resetBtn) resetBtn.classList.add("hide");
    resetGame();
};

const startGame = (isSinglePlayer) => {
    isComputerPlayer = isSinglePlayer;
    modeSelector.classList.add("hide");
    gameContainer.classList.remove("hide");
    if (resetBtn) resetBtn.classList.remove("hide");
    resetGame();
};

const getComputerMove = () => {
    // Simple AI: prioritize winning, then blocking, then random
    let emptyBoxes = [];
    
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            emptyBoxes.push(i);
        }
    }
    
    // Check if computer can win
    for (const index of emptyBoxes) {
        boxes[index].innerText = "X";
        if (checkWinCondition("X")) {
            boxes[index].innerText = "";
            return index;
        }
        boxes[index].innerText = "";
    }
    
    // Check if need to block player
    for (const index of emptyBoxes) {
        boxes[index].innerText = "O";
        if (checkWinCondition("O")) {
            boxes[index].innerText = "";
            return index;
        }
        boxes[index].innerText = "";
    }
    
    // Random move
    return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
};

const checkWinCondition = (player) => {
    for (const pattern of winpatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val && pos1Val === player) {
                return true;
            }
        }
    }
    return false;
};

const makeComputerMove = () => {
    if (!isComputerPlayer || !gameActive || turn0) return;
    
    setTimeout(() => {
        let computerMoveIndex = getComputerMove();
        if (computerMoveIndex !== undefined) {
            boxes[computerMoveIndex].innerText = "X";
            boxes[computerMoveIndex].classList.add("x");
            boxes[computerMoveIndex].disabled = true;
            turn0 = true;
            checkWinner();
        }
    }, 500);
}; 

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!gameActive) return;
        if (turn0 === true) {
            box.innerText = "O";
            box.classList.add("o");
            box.classList.remove("x");
            turn0 = false;
        } else {
            if (!isComputerPlayer) {
                box.innerText = "X";
                box.classList.add("x");
                box.classList.remove("o");
                turn0 = true;
            }
        }
        box.disabled = true;

        checkWinner();
        
        if (isComputerPlayer && !turn0 && gameActive) {
            makeComputerMove();
        }
    });
});

const enableBoxes =() =>{
    for(let box of boxes){
        box.disabled =false;
    }
};

const disableBoxes =() =>{
    for(let box of boxes){
        box.disabled =true;
    }
};

const showWinner = (winner) => {
    gameActive = false;
    if (msg) {
        if (isComputerPlayer && winner === "X") {
            msg.innerText = `Computer wins!`;
        } else if (isComputerPlayer && winner === "O") {
            msg.innerText = `You are the winner: ${winner}`;
        } else {
            msg.innerText = `You are the winner: ${winner}`;
        }
    }
    if (msgContainer) msgContainer.classList.remove("hide");
    disableBoxes();
}; 

const showDraw = () => {
    if (msg) msg.innerText = `Game Draw`;
    if (msgContainer) msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for (const pattern of winpatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val !="" && pos2Val !="" && pos3Val !=""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                console.log("winner",pos1Val);
                showWinner(pos1Val);
                return; // stop further checks
            }
        }
    }

    // If all boxes are filled and no winner, it's a draw
    let allFilled = true;
    for (let box of boxes) {
        if (box.innerText === "") { allFilled = false; break; }
    }
    if (allFilled) {
        showDraw();
    }
}; 

if (newGameBtn) newGameBtn.addEventListener("click", startModeSelector);
if (resetBtn) resetBtn.addEventListener("click", resetGame);
if (singlePlayerBtn) singlePlayerBtn.addEventListener("click", () => startGame(true));
if (doublePlayerBtn) doublePlayerBtn.addEventListener("click", () => startGame(false));

// Start with mode selector
startModeSelector();