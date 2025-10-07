const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-400, 400, 400, -400, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 800);
container.appendChild(renderer.domElement);

function createDVDTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DVD', canvas.width / 2, canvas.height / 2);

  return new THREE.CanvasTexture(canvas);
}

let colorList = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
let currentColor = colorList[Math.floor(Math.random() * colorList.length)];
const texture = createDVDTexture(currentColor);

const geometry = new THREE.PlaneGeometry(120, 60);
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
const dvd = new THREE.Mesh(geometry, material);
scene.add(dvd);

dvd.position.set(0, 0, 0);
dvd.scale.set(1, 1, 1);

const borderGeometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(800, 800));
const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const border = new THREE.LineSegments(borderGeometry, borderMaterial);
scene.add(border);

let velocityX = 3;
let velocityY = 2.5;
let bounceCount = 0;
const shrinkFactor = 0.93;

function changeColor() {
  currentColor = colorList[Math.floor(Math.random() * colorList.length)];
  dvd.material.map = createDVDTexture(currentColor);
  dvd.material.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);

  dvd.position.x += velocityX;
  dvd.position.y += velocityY;

  const halfW = 400;
  const halfH = 400;
  const logoHalfW = (geometry.parameters.width * dvd.scale.x) / 2;
  const logoHalfH = (geometry.parameters.height * dvd.scale.y) / 2;

  let bounced = false;

  if (dvd.position.x + logoHalfW >= halfW || dvd.position.x - logoHalfW <= -halfW) {
    velocityX = -velocityX;
    bounced = true;
  }

  if (dvd.position.y + logoHalfH >= halfH || dvd.position.y - logoHalfH <= -halfH) {
    velocityY = -velocityY;
    bounced = true;
  }

  if (bounced) {
    bounceCount++;
    dvd.scale.multiplyScalar(shrinkFactor);
    changeColor();
  }

  if (bounceCount >= 8 || dvd.scale.x < 0.05) {
    dvd.visible = false;
  }

  renderer.render(scene, camera);
}

animate();

