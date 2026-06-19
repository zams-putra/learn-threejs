import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const bola = document.querySelector('.bola')
const sizes = {
  width: bola.clientWidth,
  height: bola.clientHeight
};


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);


const renderer = new THREE.WebGLRenderer({
  antialias: true
});


renderer.setSize(sizes.width, sizes.height);
bola.appendChild( renderer.domElement );


camera.position.z = 40;

const geometry = new THREE.SphereGeometry( 15, 32, 16 );

const loader = new THREE.TextureLoader()
const texture = await loader.loadAsync('img/nasgor.jpeg')
const material = new THREE.MeshStandardMaterial({map: texture})

const bumi = new THREE.Mesh( geometry, material );
scene.add( bumi );


const light = new THREE.PointLight(0xffffff, 500);
light.position.set(15, 2, 30);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
ambient.position.set(18, 29, 2)
scene.add(ambient);


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
camera.position.set( 0, 0, 60 );
controls.update();
function animate() {
    controls.update();
   
  if( bumi) {
     bumi.rotation.y += 0.01
  }
  
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );