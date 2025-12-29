const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Geometry
const geometry = new THREE.IcosahedronGeometry(8, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 25;

// Mouse interaction
document.addEventListener("mousemove", (e) => {
  mesh.rotation.y = e.clientX * 0.0005;
  mesh.rotation.x = e.clientY * 0.0005;
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.z += 0.002;
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
