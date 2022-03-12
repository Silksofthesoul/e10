const elMain = document.body;
let fr = 60;
let width = elMain.offsetWidth || 640;
let height = elMain.offsetHeight || 640;


let worm = new Worm({
  width: parseInt(width / 2),
  height: parseInt(height / 2),
  x: parseInt(width / 2) / 2,
  y: parseInt(height / 2) / 2,
});

function setup() {
  createCanvas(width, height);
  frameRate(fr);
}

function draw() {
  background('rgba(255, 255, 255, 0.02)');

  worm.step();
  worm.render();

}
