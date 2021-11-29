import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import "/jsm/libs/stats.module.js";
// import { FontLoader } from '/FontLoader.js';
import Character from '/character.js';

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

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight)

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
  scene.add(front, back)
}
addPlane()

Character.rotateChildrenOfObject(character.right_shoulder, new THREE.Vector3(0, 1, 0), 75);
Character.rotateChildrenOfObject(character.left_shoulder, new THREE.Vector3(0, 1, 0), 75);


function animate() {
  requestAnimationFrame(animate);

  Character.rotateChildrenOfObject(character.right_shoulder, new THREE.Vector3(1, 0, 0), -5);
  Character.rotateChildrenOfObject(character.left_shoulder, new THREE.Vector3(1, 0, 0), -5);

  controls.update();
  renderer.render(scene, camera);
}

animate();

