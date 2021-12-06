import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import "/jsm/libs/stats.module.js";
import Character from '/character.js';
import Helper from './helper.js'
import { GUI } from '/dat.gui.module.js';
import FrameManager from '/framemanager.js'
import PlayerManager from '/playermanager.js'

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
    camera.aspect = (window.innerWidth-menuOffset) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( (window.innerWidth-menuOffset), window.innerHeight );
}

//scene helpers
const axesHelper = new THREE.AxesHelper( 30 );
scene.add( axesHelper );

const light = new THREE.DirectionalLight( 0xffffff, 0.5, 100 );
const light2 = new THREE.AmbientLight( 0xffffff, 0.4, 100 );
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
  var front = new THREE.Mesh(new THREE.BoxGeometry(width, 10, length), new THREE.MeshStandardMaterial({ color: 0xCCCCFF }))
  front.position.set(0, -5, length / 2)
  var back = new THREE.Mesh(new THREE.BoxGeometry(width, 10, length), new THREE.MeshStandardMaterial({ color: 0xCCCCFF }))
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

//frame clicker needs to be moved
function onDocumentMouseDown( event ) {
    if(window['globalvars'].isAnimating == false) return

    try{
      event.preventDefault();
      mouse.x = ( (event.clientX-menuOffset)/ renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

      //gets raycasts of both the circle menu and the character
      raycaster.setFromCamera( mouse, camera );
      var intersectsAxisMenu = raycaster.intersectObjects( character.circleMenu );
      var intersects = raycaster.intersectObjects( character.group.children ); 

      if ( intersects.length > 0 ) {
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
    } else if((character.circleMenu.length > 0 && intersectsAxisMenu.length > 0) ) {
        controls.enabled = false;
        isDragging = true;

        axis_name = intersectsAxisMenu[0].object.name

        lastClickPos = {
          x: event.offsetX,
          y: event.offsetY
        };

        partClickPos = Helper.toScreenPosition(new THREE.Vector3(selected_obj.position.x, selected_obj.position.y, selected_obj.position.z), camera)
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

      if(part && direction && angle_in_radians && character) {
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
controls.target = new THREE.Vector3(0, 75, 0)
controls.enablePan = false;
controls.update

var characterPos = [character.getPlayerJointPositions()]
var frameManager = FrameManager.getInstance(character);
var playManager = PlayerManager.getInstance(character);

function animate() {
  setTimeout( function() {
    requestAnimationFrame( animate );
  }, 1000 / 30 / playManager.speed );

    if(playManager.playing) {

        //REFACTOR THIS
        // check for any selected object 
        // if(selected_obj) {
        //   selected_obj.material.color.setHex(old_color)
        //   selected_obj = null;
        // }

        if(playManager.frames[playManager.frame_index] != null) {
          character.applyNewPlayerPosition(playManager.frames[playManager.frame_index])
          playManager.frame_index++;
          if(playManager.frame_index == playManager.frames.length){
            playManager.playing = false;
            playManager.frame_index = 0;
          }
        } else {
          playManager.playing = false;
          playManager.frame_index = 0;
        }
    } else if(frameManager.playing) {

        //REFACTOR THIS
        // check for any selected object 
        // if(selected_obj) {
        //   selected_obj.material.color.setHex(old_color)
        //   selected_obj = null;
        // }

        if(frameManager.frames[frameManager.frame_index] != null) {
          character.applyNewPlayerPosition(frameManager.frames[frameManager.frame_index])
          frameManager.frame_index++;
          if(frameManager.frame_index == frameManager.frames.length){
            frameManager.playing = false;
            frameManager.frame_index = 0;
          }
        } else {
          frameManager.playing = false;
          frameManager.frame_index = 0;
        }
      }

  controls.update();
  renderer.render(scene, camera);
}

animate();

