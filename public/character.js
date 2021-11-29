import * as THREE from '/build/three.module.js';

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

        this.torso = new part(new THREE.Mesh( new THREE.BoxGeometry( tor_w, tor_h, radius*2 ), new THREE.MeshStandardMaterial( {color: 0xffd100} ) ), [this.neck, this.left_shoulder, this.right_shoulder, this.left_hip, this.right_hip])

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

        this.group = new THREE.Group();
        this.group.add(this.torso.mesh, this.head.mesh, this.neck.mesh, this.left_shoulder.mesh, this.right_shoulder.mesh, this.left_hip.mesh, this.right_hip.mesh, this.right_elbow.mesh, this.left_elbow.mesh, this.right_knee.mesh, this.left_knee.mesh, this.right_hand.mesh, this.left_hand.mesh, this.right_foot.mesh, this.left_foot.mesh)
    }

    addToScene(scene) {
        // console.log(this.group.children)
        this.group.castShadow = true;
        scene.add(this.group)
    }

    rotateBody(axis, angle) {
        axis.normalize();

        this.constructor.rotateChildrenOfObject(this.torso, axis, angle);
        // this.constructor.rotateAboutPoint(this.torso.mesh, this.torso.position, axis, angle)
        this.torso.mesh.rotateOnAxis(new THREE.Vector3(axis.x, 0, 0).normalize(), THREE.Math.degToRad(angle));
        this.torso.mesh.rotateOnAxis(new THREE.Vector3(0, axis.y, 0).normalize(), THREE.Math.degToRad(angle));
        this.torso.mesh.rotateOnAxis(new THREE.Vector3(0, 0, axis.z).normalize(), THREE.Math.degToRad(angle));
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
        // obj.rotateOnAxis(axis, theta); // rotate the OBJECT
        obj.rotateOnAxis(new THREE.Vector3(axis.x, 0, 0).normalize(), THREE.Math.degToRad(theta));
        obj.rotateOnAxis(new THREE.Vector3(0, axis.y, 0).normalize(), THREE.Math.degToRad(theta));
        obj.rotateOnAxis(new THREE.Vector3(0, 0, axis.z).normalize(), THREE.Math.degToRad(theta));
    }
    
    static rotateChildrenOfObject(parentObject, axis, angle) {
        axis.normalize();
        for (let child of parentObject.children) {
            //first rotate children recursively
            this.recursiveHelper(child, parentObject, axis, angle)
        }
    }
    
    static recursiveHelper(object, pivotObject, axis, angle) {
        for (let child of object.children) {
            //first rotate children recursively
            this.recursiveHelper(child, pivotObject, axis, angle)
        }
        this.rotateObjectAroundObject(object, pivotObject, axis, angle)
    }
    
    static rotateObjectAroundObject(rotatingObject, pivotObject, axis, angle) {
        this.rotateAboutPoint(rotatingObject.mesh, pivotObject.mesh.position, axis, THREE.Math.degToRad(angle)) 
    }
}


