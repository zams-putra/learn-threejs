import * as THREE from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const canvasContainer = document.querySelector('#canvas')

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
canvasContainer.appendChild( renderer.domElement );

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);

const material = new THREE.MeshLambertMaterial({
  color: 0x4ecdc4,
});

const torus = new THREE.Mesh( geometry, material );
scene.add( torus );

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

camera.position.z = 5;


const keyframes = [
  { progress: 0.00, position: [ 2, 0, 0], rotation: [0, 0, 0],   scale: 1.0, color: 0x4ecdc4 },
  { progress: 0.33, position: [-2, 0, 0], rotation: [2, 1, 0],   scale: 1.4, color: 0xff7a45 },
  { progress: 0.66, position: [ 2, 0,-2], rotation: [1, 3, 2],   scale: 0.8, color: 0xffd23f },
  { progress: 1.00, position: [-2, 0,-1], rotation: [3, 2, 4],   scale: 1.2, color: 0xff3b6b },
];

function getTargetAt(progress) {
  let a = keyframes[0], b = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].progress && progress <= keyframes[i + 1].progress) {
      a = keyframes[i]; b = keyframes[i + 1];
      break;
    }
  }

  const span = b.progress - a.progress;
  const t = span === 0 ? 0 : (progress - a.progress) / span;
 
  return {
    position: [0, 1, 2].map(i => THREE.MathUtils.lerp(a.position[i], b.position[i], t)),
    rotation: [0, 1, 2].map(i => THREE.MathUtils.lerp(a.rotation[i], b.rotation[i], t)),
    scale: THREE.MathUtils.lerp(a.scale, b.scale, t),
    color: new THREE.Color(a.color).lerp(new THREE.Color(b.color), t),
  };
}
 

let target = getTargetAt(0);
const progressBar = document.getElementById('progress-bar');
 
function onScroll() {
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
  target = getTargetAt(progress);
  progressBar.style.width = (progress * 100) + '%';
}
window.addEventListener('scroll', onScroll);
onScroll();
 

function animate() {
  requestAnimationFrame(animate);
 
  const smoothing = 0.07; 
 
  torus.position.x = THREE.MathUtils.lerp(torus.position.x, target.position[0], smoothing);
  torus.position.y = THREE.MathUtils.lerp(torus.position.y, target.position[1], smoothing);
  torus.position.z = THREE.MathUtils.lerp(torus.position.z, target.position[2], smoothing);
 
  torus.rotation.x = THREE.MathUtils.lerp(torus.rotation.x, target.rotation[0], smoothing);
  torus.rotation.y = THREE.MathUtils.lerp(torus.rotation.y, target.rotation[1], smoothing);
  torus.rotation.z = THREE.MathUtils.lerp(torus.rotation.z, target.rotation[2], smoothing);
 
  const currentScale = torus.scale.x;
  const newScale = THREE.MathUtils.lerp(currentScale, target.scale, smoothing);
  torus.scale.set(newScale, newScale, newScale);
 
  torus.material.color.lerp(target.color, smoothing);

  torus.rotation.y += 0.002;
 
  renderer.render(scene, camera);
}
animate();
 
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});