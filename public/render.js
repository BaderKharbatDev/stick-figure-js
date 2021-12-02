import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import "/jsm/libs/stats.module.js";
import Character from '/character.js';
import Helper from './helper.js'
import { GUI } from '/dat.gui.module.js';

//init
export const menuOffset = 200;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth-menuOffset) / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth-menuOffset, window.innerHeight);
camera.position.setZ(200);
camera.position.setY(200);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//scene helpers
const axesHelper = new THREE.AxesHelper( 30 );
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
var cc = document.getElementsByTagName("canvas");
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var selected_obj = null;
var old_color = null;
var isDragging = false;
var lastClickPos;
var partClickPos;
var axis_name;

function onDocumentMouseDown( event ) {
    if(window['globalvars'].isAnimating == false) return

    try{
      event.preventDefault();
      mouse.x = ( (event.clientX-menuOffset)/ renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse, camera );
      var intersectsAxisMenu = raycaster.intersectObjects( character.circleMenu );
      var intersects = raycaster.intersectObjects( character.group.children ); 

      var isDuplicate = false;
      var isCircle = false;
      if(intersectsAxisMenu.length > 0 && intersects.length > 0) {
        isDuplicate = true;
        var firstIntersect = raycaster.intersectObjects( scene.children )[0].object;
        for(var i = 0; i < character.circleMenu.length; i++) {
          if(character.circleMenu[i] == firstIntersect) {
            isCircle = true;
          }
        }
      }

      if((character.circleMenu.length > 0 && intersectsAxisMenu.length > 0) && !(isCircle ^ isDuplicate)) {
        controls.enabled = false;
        isDragging = true;

        axis_name = intersectsAxisMenu[0].object.name

        lastClickPos = {
          x: event.offsetX,
          y: event.offsetY
        };

        partClickPos = Helper.toScreenPosition(new THREE.Vector3(selected_obj.position.x, selected_obj.position.y, selected_obj.position.z), camera)
      } else if ( intersects.length > 0 ) {
          try {
            if(selected_obj != null) {
              selected_obj.material.color.setHex(old_color)
              character.closeMenu();
            }
            if(intersects[0].object == selected_obj) {
              selected_obj.material.color.setHex(old_color)
              selected_obj = null;
              old_color = null;
              character.closeMenu();
            } else {
              selected_obj = intersects[0].object;
              old_color = JSON.parse(JSON.stringify(selected_obj.material.color));
              selected_obj.material.color.setHex(0x000000);
              character.openMenu(selected_obj);
            }
          } catch (error) {
            console.log(error)
          }
      }
    } catch(error) {
      console.log(error)
    }
}
cc[0].addEventListener('mousedown', onDocumentMouseDown)

function onDocumentMouseUp( event ) {
  if(isDragging) isDragging = false;
  controls.enabled = true;
}
cc[0].addEventListener('mouseup', onDocumentMouseUp)

var lastMove = 0;
function onDocumentMouseMove( event ) {
  if(window['globalvars'].isAnimating == false) return
  if(!isDragging) return

  mouse.x = ( (event.clientX-menuOffset)/ renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

  if(Date.now() - lastMove > 50) {
      //move arm
      let newPos = {
        x: event.offsetX,
        y: event.offsetY
      };
  
      var old_dir = new THREE.Vector2(); // create once an reuse it
      old_dir.subVectors( new THREE.Vector2(partClickPos.x,partClickPos.y), new THREE.Vector2(lastClickPos.x, lastClickPos.y)).normalize(); 
      var new_dir = new THREE.Vector2(); // create once an reuse it
      new_dir.subVectors( new THREE.Vector2(partClickPos.x, partClickPos.y), new THREE.Vector2(newPos.x, newPos.y)).normalize(); 
  
      var cosAB = old_dir.dot( new_dir );
      var angle_in_radians = Math.acos( cosAB );
      // console.log(THREE.Math.radToDeg(angle_in_radians))
      var direction = (( old_dir.cross( new_dir ) < 0) ? 1 : -1);

      var part;
      for (var key in character) {
          if(character[key] != null && character[key].mesh != null && character[key].mesh == selected_obj) {
              part = character[key];
              break
          }
      }

      var vector = new THREE.Vector3();
      var camera_vector = camera.getWorldDirection(vector);

      //rotate according to the axis
      switch(axis_name) {
        case 'x':
          if(camera_vector.x > 0) direction = direction * -1
          Character.rotateChildrenOfObject(part, new THREE.Vector3(1, 0, 0), direction*THREE.Math.radToDeg(angle_in_radians), character)
          break;
        case 'y':
          if(camera_vector.y > 0) direction = direction * -1
          Character.rotateChildrenOfObject(part, new THREE.Vector3(0, 1, 0), direction*THREE.Math.radToDeg(angle_in_radians), character)
          break;
        case 'z':
          if(camera_vector.z > 0) direction = direction * -1
          Character.rotateChildrenOfObject(part, new THREE.Vector3(0, 0, 1), direction*THREE.Math.radToDeg(angle_in_radians), character)
          break;
      }
  
      if(newPos.x == lastClickPos.x && newPos.y == lastClickPos.y) {
        //
      } else {
        lastClickPos = newPos
      }

    lastMove = Date.now();
  } 
}
cc[0].addEventListener('mousemove', onDocumentMouseMove)

//controls
var controls = new OrbitControls(camera, renderer.domElement)
controls.target = character.torso.mesh.position
controls.enablePan = false;
controls.update

//frame gui
var gui = new GUI();
gui.domElement.id = 'frame-gui';
const folder = gui.addFolder('Frame Menu')
var characterPos = [character.getPlayerJointPositions()]

var playing = false;
var frame_index = 0;

var x = { 
  SavePosition:function() {
    characterPos.push(character.getPlayerJointPositions())
  },
  ShowPosition:function() {
    // character.applyNewPlayerPosition(characterPos[characterPos.length-1])
    if(selected_obj) selected_obj.material.color.setHex(old_color)
    playing = true;
  }
};
folder.add(x, 'SavePosition')
folder.add(x, 'ShowPosition')
folder.open();

function animate() {
  setTimeout( function() {
    requestAnimationFrame( animate );
  }, 1000 / 24 );

  if(playing) {
    character.applyNewPlayerPosition(characterPos[frame_index])
    frame_index++;
    if(frame_index == characterPos.length) frame_index = 0; //playing = false;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

