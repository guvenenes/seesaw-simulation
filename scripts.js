function getRandomWeight(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomWeight = getRandomWeight(1, 10);
const leftWeights = [];
const rightWeights = [];
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
document.getElementById("nextWeight").innerHTML = `${randomWeight} kg`;

function calculateSum(array) {
  return array.reduce((accumulator, item) => {
    return accumulator + item.weight;
  }, 0);
}

function updateDisplay(compareX) {
  if (compareX > 0) {
    document.getElementById("rightWeight").innerHTML = `${rightWeightSum} kg`;
  } else {
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

function createCircle(weight, clickX, clickY) {
  const circle = document.createElement("div");
  const plank = document.querySelector("#plank");
  const plankRect = plank.getBoundingClientRect();
  const seesawContainer = document.getElementById("seesaw-container");
  const seesawRect = seesawContainer.getBoundingClientRect();

  const circleSize = (weight + 8) * 5;
  const circleRadius = circleSize / 2;

  circle.style.position = "absolute";
  circle.style.height = `${circleSize}px`;
  circle.style.width = `${circleSize}px`;
  circle.style.backgroundColor = generateRandomColor();
  circle.style.color = "white";
  circle.style.borderRadius = "50%";
  circle.style.left = `${clickX}px`;
  circle.style.top = `-${600 / 2}px`;
  circle.style.zIndex = "15";
  circle.style.fontSize = "17px";
  circle.style.display = "flex";
  circle.style.alignItems = "center";
  circle.style.justifyContent = "center";
  circle.textContent = `${weight}kg`;
  circle.style.transition = "top 1s ease-in-out";

  plank.appendChild(circle);

  requestAnimationFrame(() => {
    circle.style.top = `${-circleRadius + 10}px`;
    circle.style.left = `${clickX - plankRect.left}px`;
  });
}

function newCircle(e) {
  const clickX = e.clientX;
  const clickY = e.clientY;

  const pivotCenter = getPivotCenter();

  const compareX = clickX - pivotCenter.x;

  if (compareX > 0) {
    rightWeights.push({
      weight: randomWeight,
      distance: Math.abs(compareX),
    });
    rightWeightSum = calculateSum(rightWeights);
    rightTorque = calculateTorque(rightWeights);
  } else {
    leftWeights.push({
      weight: randomWeight,
      distance: Math.abs(compareX),
    });
    leftWeightSum = calculateSum(leftWeights);
    leftTorque = calculateTorque(leftWeights);
  }

  updateDisplay(compareX);
  calculateAngle();
  createCircle(randomWeight, clickX, clickY);
  randomWeight = getRandomWeight(1, 10);
  document.getElementById("nextWeight").innerHTML = `${randomWeight} kg`;
}
