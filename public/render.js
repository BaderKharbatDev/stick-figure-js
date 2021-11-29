import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import "/jsm/libs/stats.module.js";
// import { FontLoader } from '/FontLoader.js';
import Character from '/character.js';
import { GUI } from '/dat.gui.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(200);
camera.position.setY(200);

const light = new THREE.DirectionalLight( 0xffffff, 0.5, 100 );
const light2 = new THREE.AmbientLight( 0xffffff, 0.5, 100 );
light.position.y = 200
light.position.z = 300
light.castShadow = true;
scene.add(light, light2)

var character = new Character();
character.addToScene(scene);

const controls = new OrbitControls(camera, renderer.domElement)
controls.target = character.torso.mesh.position
controls.update

function addPlane() {
  let length = 5000;
  let width = 10000;
  var front = new THREE.Mesh(new THREE.BoxGeometry(width, 10, length), new THREE.MeshStandardMaterial({ color: 0xbbbbbb }))
  front.position.set(0, -5, length / 2)
  var back = new THREE.Mesh(new THREE.BoxGeometry(width, 10, length), new THREE.MeshStandardMaterial({ color: 0xE2E5DE }))
  back.position.set(0, -5, -1 * length / 2)
  front.receiveShadow = true;
  back.receiveShadow = true;
  scene.add(front, back)
}
addPlane()

// const gui = new GUI()
// const cubeFolder = gui.addFolder('Cube')
// cubeFolder.add(character.torso.mesh.rotation, 'x', 0, Math.PI * 2)
// cubeFolder.add(character.torso.mesh.rotation, 'y', 0, Math.PI * 2)
// cubeFolder.add(character.torso.mesh.rotation, 'z', 0, Math.PI * 2)
// cubeFolder.open()

// Character.rotateChildrenOfObject(character.right_shoulder, new THREE.Vector3(0, 1, 0), 75);
// Character.rotateChildrenOfObject(character.left_shoulder, new THREE.Vector3(0, 0, 1), 75);

function createCircle(size, color, xR, yR, zR, x, y, z) {
  const geometry = new THREE.CircleGeometry( size, 100 );
  const material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
  const circle = new THREE.Mesh( geometry, material );
  circle.position.set(x, y, z)
  circle.rotation.x = xR
  circle.rotation.y = yR
  circle.rotation.z = zR
  scene.add( circle );
}
createCircle(10, 0x87ff00, 0, 0, Math.PI / 2, character.right_shoulder.mesh.position.x, character.right_shoulder.mesh.position.y, character.right_shoulder.mesh.position.z)
createCircle(10, 0xff0000, 0, Math.PI / 2, 0, character.right_shoulder.mesh.position.x, character.right_shoulder.mesh.position.y, character.right_shoulder.mesh.position.z)
createCircle(10, 0x3e00ff, Math.PI / 2, 0, 0, character.right_shoulder.mesh.position.x, character.right_shoulder.mesh.position.y, character.right_shoulder.mesh.position.z)

function animate() {
  requestAnimationFrame(animate);

  // character.torso.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(5));
  // character.torso.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(5));

  // character.rotateBody(new THREE.Vector3(1, 1, 0), -2)
  // Character.rotateChildrenOfObject(character.right_shoulder, new THREE.Vector3(1, 1, 0), -5);
  // Character.rotateChildrenOfObject(character.torso, new THREE.Vector3(1, 1, 0), -5);

  controls.update();
  renderer.render(scene, camera);
}

animate();

