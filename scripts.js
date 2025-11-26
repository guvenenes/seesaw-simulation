function getRandomWeight(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomWeight = getRandomWeight(1, 10);

document.getElementById("nextWeightValue").innerHTML = `${randomWeight} kg`;

function newCircle() {
  console.log(randomWeight, " kg top geldi");
  randomWeight = getRandomWeight(1, 10);
  document.getElementById("nextWeightValue").innerHTML = `${randomWeight} kg`;
}
