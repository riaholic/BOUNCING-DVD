const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 800);
document.getElementById("container").appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 0.5);
let material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
const dvdLogo = new THREE.Mesh(geometry, material);
scene.add(dvdLogo);

let velocityX = 0.04;
let velocityY = 0.03;
let scale = 1;

function getRandomColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

function animate() {
  requestAnimationFrame(animate);

  dvdLogo.position.x += velocityX;
  dvdLogo.position.y += velocityY;

  const limitX = 3.5 * scale;
  const limitY = 3.5 * scale;

  if (dvdLogo.position.x > limitX || dvdLogo.position.x < -limitX) {
    velocityX = -velocityX;
    onBounce();
  }

  if (dvdLogo.position.y > limitY || dvdLogo.position.y < -limitY) {
    velocityY = -velocityY;
    onBounce();
  }

  renderer.render(scene, camera);
}

function onBounce() {
  dvdLogo.material.color = getRandomColor();

  scale *= 0.85;
  dvdLogo.scale.set(scale, scale, scale);

  if (scale < 0.05) {
    dvdLogo.visible = false;
  }
}

dvdLogo.position.set(0, 0, 0);

animate();
