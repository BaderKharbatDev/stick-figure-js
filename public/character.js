import * as THREE from '/build/three.module.js';
import { GUI } from '/dat.gui.module.js';

let gui;

class part {
    constructor( mesh, children, distanceFromParent ) {
        this.mesh = mesh;
        this.children = children;
        // this.mesh.position.set(position.x, position.y, position.z);
        this.distanceFromParent = distanceFromParent
    }
}

export default class character {

    constructor() {
        let radius = 3;
        let arm_d = 20;
        let leg_d = 25;
        let tor_w = 30;
        let tor_h = 50;

        this.right_hand = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0x0000FF}) ), []);
        this.left_hand = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347}) ), []);
        this.right_foot = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0x0000FF}) ), []);
        this.left_foot = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347}) ), []);
        
        this.right_elbow = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347}) ), [this.right_hand]);
        this.left_elbow = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347}) ), [this.left_hand]);
        this.right_knee = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347}) ), [this.right_foot]);
        this.left_knee = new part( new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347}) ), [this.left_foot]);
        
        this.left_hip = new part(new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347 }) ), [this.left_knee]);
        this.right_hip = new part(new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347 }) ), [this.right_knee]);
        this.left_shoulder = new part(new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347 }) ), [this.left_elbow]);
        this.right_shoulder = new part(new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347 }) ), [this.right_elbow]);
        this.head = new part(new THREE.Mesh( new THREE.SphereGeometry(7, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347 }) ), []);
        this.neck = new part(new THREE.Mesh( new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: 0xFF6347 }) ), [this.head]);

        this.torso = new part(new THREE.Mesh( new THREE.SphereGeometry( radius, 24, 24 ), new THREE.MeshStandardMaterial( {color: 0xffd100} ) ), [this.neck, this.left_shoulder, this.right_shoulder, this.left_hip, this.right_hip])

        //positions
        this.left_foot.mesh.position.set(1*tor_w/2-radius,radius,0);
        this.right_foot.mesh.position.set(-1*tor_w/2+radius, radius, 0);
        this.left_knee.mesh.position.set(1*tor_w/2-radius,this.right_foot.mesh.position.y+leg_d,0);
        this.right_knee.mesh.position.set(-1*tor_w/2+radius,this.right_foot.mesh.position.y+leg_d,0);
        this.left_hip.mesh.position.set(1*tor_w/2-radius, this.left_knee.mesh.position.y+leg_d, 0);
        this.right_hip.mesh.position.set(-1*tor_w/2+radius, this.right_knee.mesh.position.y+leg_d, 0);
        this.torso.mesh.position.set(0,this.left_hip.mesh.position.y+tor_h/2,0);
        this.left_shoulder.mesh.position.set(1*tor_w/2,this.left_hip.mesh.position.y+tor_h,0);
        this.right_shoulder.mesh.position.set(-1*tor_w/2,this.right_hip.mesh.position.y+tor_h,0);
        this.left_elbow.mesh.position.set(1*arm_d+this.left_shoulder.mesh.position.x, this.left_hip.mesh.position.y+tor_h, 0);
        this.right_elbow.mesh.position.set(-1*arm_d+this.right_shoulder.mesh.position.x,this.right_hip.mesh.position.y+tor_h, 0);
        this.left_hand.mesh.position.set(1*arm_d+this.left_elbow.mesh.position.x, this.left_hip.mesh.position.y+tor_h, 0);
        this.right_hand.mesh.position.set(-1*arm_d+this.right_elbow.mesh.position.x,this.left_hip.mesh.position.y+tor_h, 0);
        this.neck.mesh.position.set(0,this.left_hip.mesh.position.y+tor_h,0);
        this.head.mesh.position.set(0,this.neck.mesh.position.y+arm_d,0);

        // var plane = new THREE.PlaneGeometry( tor_w, tor_h, 1 );
        // this.torso_wall = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide} ) );
        // this.torso_wall.position.set(this.torso.mesh.position.x, this.torso.mesh.position.y, this.torso.mesh.position.z);

        // var plane = new THREE.Plane();
        // plane.setFromCoplanarPoints(new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3())
        // var geometry = new THREE.PlaneGeometry(100, 100);
        // var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xFF6347 }));
        // mesh.translate(plane.coplanarPoint());
        // mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), plane.normal);

        this.group = new THREE.Group();
        this.group.add(this.torso.mesh, this.head.mesh, this.neck.mesh, this.left_shoulder.mesh, this.right_shoulder.mesh, this.left_hip.mesh, this.right_hip.mesh, this.right_elbow.mesh, this.left_elbow.mesh, this.right_knee.mesh, this.left_knee.mesh, this.right_hand.mesh, this.left_hand.mesh, this.right_foot.mesh, this.left_foot.mesh)
        this.torso.mesh.visible = false
    }

    addToScene(scene) {
        scene.add(this.group)
    }

    
    //helpers
    updateTorso() {
        // var box = new THREE.Box3().setFromObject( points );

    }

    rotateTorso(axis, angle) {
        axis.normalize();
        this.constructor.rotateChildrenOfObject(this.torso, axis, angle)
        console.log(axis)
        // this.torso_wall.rotation.x += THREE.Math.degToRad(angle) * axis.x
        // this.torso_wall.rotation.y += THREE.Math.degToRad(angle) * axis.y
        // this.torso_wall.rotation.z += THREE.Math.degToRad(angle) * axis.z
        // this.torso_wall.rotation.set
    }

    static rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
        axis.normalize();

        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
        if(pointIsWorld){
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }
        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset
        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }
        obj.rotateOnAxis(new THREE.Vector3(axis.x, 0, 0).normalize(), THREE.Math.degToRad(theta));
        obj.rotateOnAxis(new THREE.Vector3(0, axis.y, 0).normalize(), THREE.Math.degToRad(theta));
        obj.rotateOnAxis(new THREE.Vector3(0, 0, axis.z).normalize(), THREE.Math.degToRad(theta));
    }
    
    static rotateChildrenOfObject(parentObject, axis, angle) {
        axis.normalize();
        for (let child of parentObject.children) {
            this.recursiveHelper(child, parentObject, axis, angle)
        }
    }
    
    static recursiveHelper(object, pivotObject, axis, angle) {
        for (let child of object.children) {
            this.recursiveHelper(child, pivotObject, axis, angle)
        }
        this.rotateObjectAroundObject(object, pivotObject, axis, angle)
    }
    
    static rotateObjectAroundObject(rotatingObject, pivotObject, axis, angle) {
        this.rotateAboutPoint(rotatingObject.mesh, pivotObject.mesh.position, axis, THREE.Math.degToRad(angle)) 
    }

    static openMenu(part) {
        gui = new GUI();
        const xFolder = gui.addFolder('X Axis')
        var x = { 
            AnglePos:function(){

            },
            AngleNeg:function(){

            }
        };
        xFolder.add(x, 'AnglePos')
        xFolder.add(x, 'AngleNeg')
        const yFolder = gui.addFolder('Y Axis')
        var y = { 
            AnglePos:function(){

            },
            AngleNeg:function(){

            }
        };
        yFolder.add(y, 'AnglePos')
        yFolder.add(y, 'AngleNeg')
        const zFolder = gui.addFolder('Z Axis')
        var z = { 
            AnglePos:function(){

            },
            AngleNeg:function(){

            }
        };
        zFolder.add(z, 'AnglePos')
        zFolder.add(z, 'AngleNeg')
        xFolder.open()
        yFolder.open()
        zFolder.open()
    }

    static closeMenu() {
        gui.destroy();
        // GUI.toggleHide();
    }
}






