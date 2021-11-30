import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import "/jsm/libs/stats.module.js";
import Character from '/character.js';
import { GUI } from '/dat.gui.module.js';

//init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(200);
camera.position.setY(200);

//scene helpers
const axesHelper = new THREE.AxesHelper( 200 );
scene.add( axesHelper );

const light = new THREE.DirectionalLight( 0xffffff, 0.5, 100 );
const light2 = new THREE.AmbientLight( 0xffffff, 0.5, 100 );
light.position.y = 200
light.position.z = 300
light.castShadow = true;
scene.add(light, light2)

//adds character
var character = new Character();
character.addToScene(scene);

//floor
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

//on object click
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var selected_obj = null;
var old_color = null;

function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( character.group.children ); 
    if ( intersects.length > 0 ) {
      try {
        if(selected_obj != null) {
          selected_obj.material.color.setHex(old_color)
          Character.closeMenu();
        }
        if(intersects[0].object == selected_obj) {
          selected_obj.material.color.setHex(old_color)
          selected_obj = null;
          old_color = null;
          Character.closeMenu();
        } else {
          selected_obj = intersects[0].object;
          old_color = JSON.parse(JSON.stringify(selected_obj.material.color));
          selected_obj.material.color.setHex(0x000000);
          Character.openMenu(character, selected_obj);
        }
      } catch (error) {
        console.log(error)
      }
    }
}
window.addEventListener('mousedown', onDocumentMouseDown)

//controls
var controls = new OrbitControls(camera, renderer.domElement)
controls.target = character.torso.mesh.position
controls.enablePan = false;
controls.update

// function createCircle(size, color, xR, yR, zR, x, y, z) {
//   const geometry = new THREE.CircleGeometry( size, 100 );
//   const material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
//   const circle = new THREE.Mesh( geometry, material );
//   circle.position.set(x, y, z)
//   circle.rotation.x = xR
//   circle.rotation.y = yR
//   circle.rotation.z = zR
//   scene.add( circle );
// }
// createCircle(10, 0x87ff00, 0, 0, Math.PI / 2, character.right_shoulder.mesh.position.x, character.right_shoulder.mesh.position.y, character.right_shoulder.mesh.position.z)
// createCircle(10, 0xff0000, 0, Math.PI / 2, 0, character.right_shoulder.mesh.position.x, character.right_shoulder.mesh.position.y, character.right_shoulder.mesh.position.z)
// createCircle(10, 0x3e00ff, Math.PI / 2, 0, 0, character.right_shoulder.mesh.position.x, character.right_shoulder.mesh.position.y, character.right_shoulder.mesh.position.z)

// document.addEventListener("keydown", onDocumentKeyDown, false);
// function onDocumentKeyDown(event) {
//     var keyCode = event.which;
//     if (keyCode == 87) { //w
//       character.rotateTorso(new THREE.Vector3(1, 0, 0), -10)
//     } else if (keyCode == 83) { //s
//       character.rotateTorso(new THREE.Vector3(1, 0, 0), 10)
//     } else if (keyCode == 65) { //a
//       character.rotateTorso(new THREE.Vector3(0, 1, 0), -10)
//     } else if (keyCode == 68) { //d
//       character.rotateTorso(new THREE.Vector3(0, 1, 0), 10)
//     }
// };

//slider
// var slider = document.getElementById("slider");
// slider.addEventListener("input", null);

function animate() {
  requestAnimationFrame(animate);

  // character.updateTorso(scene)

  // character.torso.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(5));
  // character.torso.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(5));

  // character.rotateBody(new THREE.Vector3(1, 1, 0), -2)
  // Character.rotateChildrenOfObject(character.right_shoulder, new THREE.Vector3(1, 1, 0), -5);
  // Character.rotateChildrenOfObject(character.torso, new THREE.Vector3(1, 1, 0), -5);

  controls.update();
  renderer.render(scene, camera);
}

animate();

