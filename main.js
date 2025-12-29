// ===== SCENE =====
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 150);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ===== LIGHTS =====
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(50, 50, 50);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 0.5));

// ===== OBJECTS =====
// Section 1: Torus Knot
const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(8, 2, 100, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe:true })
);
torus.position.y = 0;
scene.add(torus);

// Section 2: Cube Cluster
const cubes = [];
for(let i=0; i<50; i++){
  const geo = new THREE.BoxGeometry(1.5,1.5,1.5);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe:true });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(
    (Math.random()-0.5)*40,
    -50 - Math.random()*50,
    (Math.random()-0.5)*40
  );
  scene.add(cube);
  cubes.push(cube);
}

// ===== PARTICLES =====
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount*3);

for(let i=0; i<particlesCount*3; i++){
  posArray[i] = (Math.random()-0.5)*200;
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMat = new THREE.PointsMaterial({
  color:0xffffff,
  size:0.5
});

const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// ===== GSAP SCROLL ANIMATION =====
gsap.registerPlugin(ScrollTrigger);

gsap.to(camera.position, {
  y: -100,
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 1
  }
});

gsap.to(torus.rotation, {
  y: Math.PI*2,
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

// ===== MOUSE PARALLAX =====
document.addEventListener("mousemove", (e)=>{
  torus.rotation.x = e.clientY * 0.001;
  torus.rotation.y = e.clientX * 0.001;
});

// ===== ANIMATE =====
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.z += 0.002;

  // Move cubes upward slowly
  cubes.forEach(c=>{
    c.position.y += 0.05;
    if(c.position.y > 10) c.position.y = -50;
  });

  renderer.render(scene, camera);
}
animate();

// ===== RESIZE =====
window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
