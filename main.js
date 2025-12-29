// ===== SCENE =====
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 500);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"), antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ===== LIGHTS =====
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(50,50,50);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 0.5));

// ===== OBJECTS =====
// Section 1: Torus Knot
const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(8,2,100,16),
  new THREE.MeshStandardMaterial({ color:0xffffff, wireframe:true })
);
torus.position.y = 0;
scene.add(torus);

// Section 2: Cubes
const cubes = [];
for(let i=0;i<50;i++){
  const geo = new THREE.BoxGeometry(1.5,1.5,1.5);
  const mat = new THREE.MeshStandardMaterial({ color:0xffffff, wireframe:true });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set((Math.random()-0.5)*40, -100-Math.random()*50, (Math.random()-0.5)*40);
  scene.add(cube);
  cubes.push(cube);
}

// Section 3: Spheres
const spheres = [];
for(let i=0;i<30;i++){
  const geo = new THREE.SphereGeometry(2,16,16);
  const mat = new THREE.MeshStandardMaterial({ color:0xffaa00, wireframe:true });
  const s = new THREE.Mesh(geo, mat);
  s.position.set((Math.random()-0.5)*30, -200-Math.random()*50, (Math.random()-0.5)*30);
  scene.add(s);
  spheres.push(s);
}

// ===== PARTICLES =====
const particleGeo = new THREE.BufferGeometry();
const particleCount = 500;
const positions = new Float32Array(particleCount*3);
for(let i=0;i<particleCount*3;i++){ positions[i] = (Math.random()-0.5)*300; }
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
const particleMat = new THREE.PointsMaterial({ color:0xffffff, size:0.5 });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ===== GSAP SCROLL =====
gsap.registerPlugin(ScrollTrigger);
gsap.to(camera.position, {
  y: -400,
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
  camera.rotation.x = e.clientY*0.0005;
  camera.rotation.y = e.clientX*0.0005;
});

// ===== CURSOR FOLLOW =====
const cursor = document.querySelector('.cursor-circle');
document.addEventListener('mousemove', (e)=>{
  cursor.style.left = e.clientX+'px';
  cursor.style.top = e.clientY+'px';
});

// ===== ANIMATE =====
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.002;
  torus.rotation.y += 0.003;
  cubes.forEach(c=>{ c.rotation.x+=0.001; c.rotation.y+=0.002; });
  spheres.forEach(s=>{ s.rotation.y +=0.001; });

  renderer.render(scene, camera);
}
animate();

// ===== RESIZE =====
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
