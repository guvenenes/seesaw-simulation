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

function createCircle(weight, clickX, clickY) {
  const circle = document.createElement("div");
  const plank = document.querySelector("#plank");
  const plankRect = plank.getBoundingClientRect();

  circle.style.position = "absolute";
  circle.style.height = "30px";
  circle.style.width = "30px";
  circle.style.backgroundColor = "red";
  circle.style.borderRadius = "50%";
  circle.style.left = `${clickX - plankRect.left}px`;
  circle.style.top = `-5px`;
  circle.style.zIndex = "15";
  circle.style.fontSize = "12px";
  circle.style.content;
  circle.textContent = `${weight}kg`;

  plank.appendChild(circle);
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

  console.log(clickX, "XXXX");
  console.log(clickY, "YYYY");

  console.log(randomWeight, " kg top geldi");
  updateDisplay(compareX);
  calculateAngle();
  createCircle(randomWeight, clickX, clickY);
  randomWeight = getRandomWeight(1, 10);
  document.getElementById("nextWeight").innerHTML = `${randomWeight} kg`;
}
