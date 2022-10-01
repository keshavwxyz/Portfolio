import './style.css'

import * as THREE from 'three';
import { GridHelper, Material, Matrix3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 90 , window.innerWidth/window.innerHeight , 0.1 , 1000 );

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth , window.innerHeight );
camera.position.setZ(30);

renderer.render( scene , camera );

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );


scene.add( torus );

const ambientlight = new THREE.AmbientLight(0xffffff);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set( 20, 20, 20 );

scene.add(pointLight, ambientlight);

const lighthelper = new THREE.PointLightHelper(pointLight); 
const gridhelper = new THREE.GridHelper( 200, 50 );

scene.add(lighthelper, gridhelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addstars(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry,material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addstars);

const spacetexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spacetexture;

const bgScene = new THREE.Scene();
let bgMesh;
{
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    'space.jpg',
  );
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
 
  const shader = THREE.ShaderLib.equirect;
    const material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide,
  });
    material.uniforms.tEquirect.value = texture;
  const plane = new THREE.BoxBufferGeometry(2, 2, 2);
  bgMesh = new THREE.Mesh(plane, material);
  bgScene.add(bgMesh);
}

function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render( scene , camera );
}



animate();
