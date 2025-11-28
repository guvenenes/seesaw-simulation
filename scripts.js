const leftWeights = [];
const rightWeights = [];
const logItems = [];
let leftWeightSum = 0;
let rightWeightSum = 0;
let leftTorque = 0;
let rightTorque = 0;
const palette = [
  "#7f09c4ff",
  "#f83fcaff",
  "#f1e42dff",
  "#1ff3e1ff",
  "#1a8ef3ff",
  "#364fc7",
  "#2f9e44",
  "#18977cff",
  "#f77a06ff",
  "#f00909ff",
];

const plank = document.querySelector("#plank");
const seesawContainer = document.getElementById("seesaw-container");
const logs = document.getElementById("logs");

function getRandomWeight(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomWeight = getRandomWeight(1, 10);

document.getElementById("nextWeight").innerHTML = `${randomWeight} kg`;

function calculateSum(array) {
  return array.reduce((accumulator, item) => {
    return accumulator + item.weight;
  }, 0);
}

function updateDisplay(compareX = null) {
  if (compareX == 0) {
    document.getElementById("rightWeight").innerHTML = "0.0 kg";
    document.getElementById("leftWeight").innerHTML = "0.0 kg";
  } else {
    document.getElementById("rightWeight").innerHTML = `${rightWeightSum} kg`;
    document.getElementById("leftWeight").innerHTML = `${leftWeightSum} kg`;
  }
}

function calculateTorque(array) {
  return array.reduce((accumulator, item) => {
    return accumulator + item.weight * item.distance;
  }, 0);
}

function calculateAngle() {
  const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
  document.getElementById("tiltAngle").innerHTML = `${angle.toFixed(1)}°`;
  rotatePlank(angle);
  return angle;
}

function rotatePlank(angle) {
  const plank = document.getElementById("plank");
  plank.style.transform = `rotate(${angle}deg)`;
  plank.style.transition = "0.5s ease";
}

function getPivotCenter() {
  const pivot = document.getElementById("pivot").getBoundingClientRect();
  return {
    x: pivot.left + pivot.width / 2,
    y: pivot.top + pivot.height / 2,
  };
}

function generateRandomColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}

function createCircle(weight, positionOnPlank, bgColor) {
  const circle = document.createElement("div");
  const seesawRect = seesawContainer.getBoundingClientRect();
  const circleSize = (weight + 8) * 5;
  const circleRadius = circleSize / 2;

  circle.style.position = "absolute";
  circle.style.height = `${circleSize}px`;
  circle.style.width = `${circleSize}px`;
  circle.style.backgroundColor = `${bgColor}`;
  circle.style.color = "white";
  circle.style.borderRadius = "50%";
  circle.style.left = `${positionOnPlank}px`;
  circle.style.top = `-${seesawRect.height / 2}px`;
  circle.style.zIndex = "15";
  circle.style.fontSize = "17px";
  circle.style.display = "flex";
  circle.style.alignItems = "center";
  circle.style.justifyContent = "center";
  circle.textContent = `${weight}kg`;
  circle.style.transition = "top 1s ease-in";

  plank.appendChild(circle);

  requestAnimationFrame(() => {
    circle.style.top = `${-circleRadius + 10}px`;
  });
}

function newCircle(e) {
  const clickX = e.clientX;
  const clickY = e.clientY;
  const plankRect = plank.getBoundingClientRect();
  const bgColor = generateRandomColor();
  const pivotCenter = getPivotCenter();
  const positionOnPlank = clickX - plankRect.left;

  const compareX = clickX - pivotCenter.x;

  if (compareX > 0) {
    rightWeights.push({
      weight: randomWeight,
      distance: Math.abs(compareX),
      bgColor: bgColor,
      positionOnPlank: positionOnPlank,
    });
    rightWeightSum = calculateSum(rightWeights);
    rightTorque = calculateTorque(rightWeights);
  } else {
    leftWeights.push({
      weight: randomWeight,
      distance: Math.abs(compareX),
      bgColor: bgColor,
      positionOnPlank: positionOnPlank,
    });
    leftWeightSum = calculateSum(leftWeights);
    leftTorque = calculateTorque(leftWeights);
  }

  updateDisplay(compareX);
  calculateAngle();
  logItems.push({
    compareX: compareX,
    weight: randomWeight,
  });
  createCircle(randomWeight, positionOnPlank, bgColor);
  addLog(compareX, randomWeight);
  saveState();
  randomWeight = getRandomWeight(1, 10);
  document.getElementById("nextWeight").innerHTML = `${randomWeight} kg`;
}

function addLog(compareX, weight) {
  const newLog = document.createElement("div");
  let side = "";
  newLog.style.display = "flex";
  newLog.style.justifyContent = "start";
  newLog.style.alignItems = "center";
  newLog.style.margin = "15px 5px 0 5px";
  newLog.style.width = "90%";
  newLog.style.height = "20px";
  newLog.style.backgroundColor = "white";
  newLog.style.borderLeft = "3px solid blue";
  newLog.style.borderRadius = "10px";
  newLog.style.padding = "10px 15px";

  if (compareX > 0) {
    side = "right";
  } else {
    side = "left";
  }
  newLog.textContent = `🔴 ${weight}kg dropped on ${side} at ${Math.abs(
    Math.round(compareX)
  )}px from center.`;

  newLog.style.opacity = "0";
  newLog.style.transform = "translateY(-20px)";
  newLog.style.transition = "all 0.5s ease";

  logs.insertBefore(newLog, logs.firstChild);

  requestAnimationFrame(() => {
    newLog.style.opacity = "1";
    newLog.style.transform = "translateY(0)";
  });
}

function resetSeesaw() {
  const circles = plank.querySelectorAll("div");

  circles.forEach((circle) => {
    circle.style.transition = "all 0.3s ease-out";
    circle.style.opacity = "0";
    circle.style.transform = "translateY(-50px) scale(0.5)";
  });
  setTimeout(() => {
    leftWeights.length = 0;
    rightWeights.length = 0;
    leftWeightSum = 0;
    rightWeightSum = 0;
    leftTorque = 0;
    rightTorque = 0;
    plank.innerHTML = "";
    logs.innerHTML = "";
    calculateAngle();
    updateDisplay(0);
    localStorage.removeItem("seesawState");
    randomWeight = getRandomWeight(1, 10);

    document.getElementById("nextWeight").innerHTML = `${randomWeight} kg`;
  }, 300);
}

function saveState() {
  const currentAngle = calculateAngle();
  const state = {
    rightWeights: rightWeights,
    leftWeights: leftWeights,
    angle: currentAngle,
    randomWeight: randomWeight,
    leftWeightSum: leftWeightSum,
    rightWeightSum: rightWeightSum,
    leftTorque: leftTorque,
    rightTorque: rightTorque,
    logItems: logItems,
  };
  localStorage.setItem("seesawState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("seesawState");
  const state = JSON.parse(saved);
  leftWeights.length = 0;
  rightWeights.length = 0;
  logItems.length = 0;
  leftWeights.push(...state.leftWeights);
  rightWeights.push(...state.rightWeights);
  logItems.push(...state.logItems);
  angle = state.angle;
  randomWeight = state.randomWeight;
  leftWeightSum = state.leftWeightSum;
  rightWeightSum = state.rightWeightSum;
  leftTorque = state.leftTorque;
  rightTorque = state.rightTorque;

  [...leftWeights, ...rightWeights].forEach((item) => {
    createCircle(item.weight, item.positionOnPlank, item.bgColor);
  });
  state.logItems.forEach((item) => addLog(item.compareX, item.weight));
  calculateAngle();
  updateDisplay();
}
window.onload = () => {
  loadState();
};
