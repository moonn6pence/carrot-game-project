const playBtn = document.querySelector(".interface__playBtn");
const playBtnImg = document.querySelector(".interface__playBtn i");
const timer = document.querySelector(".interface__timer");
const carrotCnt = document.querySelector(".interface__cnt");
const stage = document.querySelector(".interface__stage");
const endGame = document.querySelector(".inGame__endGame");
const result = document.querySelector(".endGame__result");
const itemBox = document.querySelector(".inGame__items");
const replayBtn = document.querySelector(".endGame__replayBtn");
const replayBtnImg = document.querySelector(".endGame__replayBtn i");
const audioBugClick = new Audio("sound/bug_pull.mp3");
const audioCarrotClick = new Audio("sound/carrot_pull.mp3");
const audioAlert = new Audio("sound/alert.wav");
const audioBGM = new Audio("sound/bg.mp3");
const audioGameWin = new Audio("sound/game_win.mp3");
let curStage = 1;
let time;
let startGame;
let isPlaying = false;
let cnt = curStage + 9;

// show time on timer
function showTime(num) {
  let min = parseInt(num / 60);
  let sec = num - min * 60 > 9 ? num % 60 : `0${num % 60}`;
  timer.innerText = `0${min}:${sec}`;
}

function gameOn() {
  audioGameWin.pause();
  audioBGM.play();
  carrotCnt.innerText = `${cnt}`;
  stage.innerText = `Stage : ${curStage}`;
  time = 16 - curStage;
  showTime(time);
  endGame.style.visibility = "hidden";
  playBtn.style.visibility = "visible";
  playBtnImg.classList = "fas fa-stop";
  isPlaying = true;
}

function gameEnd() {
  audioBGM.pause();
  audioBGM.currentTime = 0;
  audioGameWin.currentTime = 0;
  endGame.style.visibility = "visible";
  playBtn.style.visibility = "hidden";
  isPlaying = false;
  playBtnImg.classList = "fas fa-play";
  replayBtnImg.classList = curStage < 10 ? "fas fa-forward" : "fas fa-redo";
  showTime(time);
  clearInterval(startGame);
}

// show result
function gameLose() {
  gameEnd();
  replayBtnImg.classList = "fas fa-redo";
  audioAlert.play();
  result.innerText = "YOU LOSE💩";
  curStage = 1;
}

function gameWon() {
  gameEnd();
  audioGameWin.play();
  result.innerText = curStage < 10 ? `NEXT LEVEL : ${++curStage}` : "YOU WON🎉";
}

// timer start
function timeOn() {
  if (time === 0) {
    gameLose();
    return;
  }
  showTime(time--);
}

function onPlay() {
  if (!isPlaying) {
    makeAllItems();
    gameOn();
    startGame = setInterval(timeOn, 1000);
  } else {
    gameLose();
  }
}

// play button
playBtn.addEventListener("click", () => {
  onPlay();
});

// replay button
replayBtn.addEventListener("click", () => {
  removeAllItems();
  onPlay();
});

// make items
function makeOneItem(item) {
  const top = Math.floor(Math.random() * 170);
  const left = Math.floor(Math.random() * 860);
  const newItem = document.createElement("img");
  newItem.setAttribute("src", `img/${item}.png`);
  newItem.setAttribute("alt", `${item}`);
  newItem.setAttribute("class", `items__img ${item}`);
  newItem.style.top = `${top}px`;
  newItem.style.left = `${left}px`;
  itemBox.appendChild(newItem);
}

// make one item
function makeAllItems() {
  cnt = curStage + 9;
  for (let i = 0; i < cnt; i++) {
    if (i < cnt - 4) {
      makeOneItem("bug");
    }
    makeOneItem("carrot");
  }
}

// remove items
function removeAllItems() {
  while (itemBox.hasChildNodes()) {
    itemBox.removeChild(itemBox.firstChild);
  }
}

// determine item
function isBugOrCarrot(event) {
  const tag = event.target.nodeName;
  const value = event.target.classList[1] ? event.target.classList[1] : null;
  if (tag === "IMG" && value === "bug") {
    audioBugClick.play();
    return "bug";
  } else if (tag === "IMG" && value === "carrot") {
    audioCarrotClick.currentTime = 0;
    audioCarrotClick.play();
    return "carrot";
  } else {
    return false;
  }
}

// item click event
document.addEventListener("click", (event) => {
  const item = isBugOrCarrot(event);
  if (!isPlaying) {
    return;
  }
  if (item === "bug") {
    gameLose();
  } else if (item === "carrot") {
    itemBox.removeChild(event.target);
    carrotCnt.innerText = `${--cnt}`;
    if (cnt === 0) {
      gameWon();
    }
  }
});
