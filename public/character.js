import * as THREE from '/build/three.module.js';
import { GUI } from '/dat.gui.module.js';


class part {
    constructor( mesh, children ) {
        this.mesh = mesh;
        this.children = children;
    }
}

function newSphere(radius, color) {
    var geometry = new THREE.SphereGeometry(radius, 24, 24)
    geometry.computeBoundingSphere()
    var sphere = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({ color: color}) )
    return sphere
}

export default class character {
    gui;
    circleMenu = [];

    constructor() {
        var radius = 3;
        var arm_d = 20;
        var leg_d = 25;
        var tor_w = 30;
        var tor_h = 50;

        this.right_hand = new part( newSphere(radius, 0x0000FF), []);
        this.left_hand = new part( new newSphere(radius, 0xFFFF00), []);
        this.right_foot = new part( newSphere(radius, 0x0000FF), []);
        this.left_foot = new part( new newSphere(radius, 0xFFFF00), []);
        
        this.right_elbow = new part( new newSphere(radius, 0xFFFF00), [this.right_hand]);
        this.left_elbow = new part( new newSphere(radius, 0xFFFF00), [this.left_hand]);
        this.right_knee = new part( new newSphere(radius, 0xFFFF00), [this.right_foot]);
        this.left_knee = new part( new newSphere(radius, 0xFFFF00), [this.left_foot]);
        
        this.left_hip = new part(new newSphere(radius, 0xFFFF00), [this.left_knee]);
        this.right_hip = new part(new newSphere(radius, 0xFFFF00), [this.right_knee]);
        this.left_shoulder = new part(new newSphere(radius, 0xFFFF00), [this.left_elbow]);
        this.right_shoulder = new part(new newSphere(radius, 0xFFFF00), [this.right_elbow]);
        this.head = new part(new newSphere(7, 0xFFFF00), []);
        this.neck = new part(new newSphere(radius, 0xFFFF00), [this.head]);

        this.torso = new part(new newSphere(radius, 0xFFFF00), [this.neck, this.left_shoulder, this.right_shoulder, this.left_hip, this.right_hip])

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
        this.group.frustumCulled=false

        this.lines = [];
        this.torso_mesh;
    }

    addToScene(scene) {
        scene.add(this.group)
        this.scene = scene
        this.drawCharacterLines()
        this.updateTorso()
    }

    #makeLine(pos1, pos2) {
        pos1 = new THREE.Vector3(parseFloat(pos1.x), parseFloat(pos1.y), parseFloat(pos1.z) )
        pos2 = new THREE.Vector3(parseFloat(pos2.x), parseFloat(pos2.y), parseFloat(pos2.z) )

        let geometry = new THREE.BufferGeometry().setFromPoints( [pos1, pos2] );
        // geometry.computeBoundingSphere()

        let material = new THREE.LineBasicMaterial( { color: 0x000000 } );
        let line = new THREE.Line(geometry, material);
        line.frustumCulled=false
        this.lines.push(line)
        return line;
    }

    //character drawing helpers
    drawCharacterLines() {
        let scene = this.scene;
        //removes all lines
        for(var i = 0; i<this.lines.length; i++) {
            scene.remove(this.lines[i])
        }
        this.lines = [];

        scene.add(this.#makeLine(this.right_foot.mesh.position, this.right_knee.mesh.position))
        scene.add(this.#makeLine(this.right_knee.mesh.position, this.right_hip.mesh.position))
        scene.add(this.#makeLine(this.left_foot.mesh.position, this.left_knee.mesh.position))
        scene.add(this.#makeLine(this.left_knee.mesh.position, this.left_hip.mesh.position))
        scene.add(this.#makeLine(this.right_shoulder.mesh.position, this.right_elbow.mesh.position))
        scene.add(this.#makeLine(this.right_elbow.mesh.position, this.right_hand.mesh.position))
        scene.add(this.#makeLine(this.left_shoulder.mesh.position, this.left_elbow.mesh.position))
        scene.add(this.#makeLine(this.left_elbow.mesh.position, this.left_hand.mesh.position))
        scene.add(this.#makeLine(this.neck.mesh.position, this.head.mesh.position))
    }

    updateTorso() {
        //first remove previous plane
        let scene = this.scene;
        try {
            scene.remove(this.torso_mesh)
        } catch(error) {}
        this.torso_mesh = this.makeNewTorsoPlane(this.left_shoulder.mesh.position, this.left_hip.mesh.position, this.right_hip.mesh.position)
        this.torso_mesh.frustumCulled=false
        this.scene.add(this.torso_mesh)
    }

    makeNewTorsoPlane(p0, p1, p2) {
        var material2 = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        
        // get direction of line p0-p1
        var direction = p1.clone().sub(p0).normalize();
        
        // project p2 on line p0-p1
        var line0 = new THREE.Line3(p0, p1);
        var proj = new THREE.Vector3();
        line0.closestPointToPoint(p2, true, proj);
        
        // get plane side direction
        var localUp = p2.clone().sub(proj).normalize();
        
        // calc plane normal vector (how we want plane to direct)
        var n = new THREE.Vector3();
        n.crossVectors(proj.clone().sub(p0), proj.clone().sub(p2));
        
        // preparation is complete, create a plane now
        const planeL = 50//2.15;
        const planeW = 27//1.75;
        
        var geometry = new THREE.PlaneGeometry(planeL, planeW, 32);
        geometry.computeBoundingSphere()

        var material3 = new THREE.MeshStandardMaterial({
            color: 0xFFFF00,
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(geometry, material3);
        
        // now align the plane to the p0-p1 in direction p2
        plane.position.copy(p0); //put plane by its center on p0
        plane.up.copy(localUp); //adjust .up for future .lookAt call
        plane.lookAt(p0.clone().add(n)); //rotate plane
        
        // now just offset plane by half width and half height
        plane.position.add(localUp.clone().multiplyScalar(planeW / 2));
        plane.position.add(direction.clone().multiplyScalar(planeL / 2));
        plane.frustumCulled=false
        return plane
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
    
    static rotateChildrenOfObject(parentObject, axis, angle, character) {
        axis.normalize();
        for (let child of parentObject.children) {
            this.recursiveHelper(child, parentObject, axis, angle)
        }
        character.drawCharacterLines()
        character.updateTorso()
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

    moveCharacterUpOrDown(val) {
        this.group.children.forEach(element => {
            element.position.y += val
        });
        for(var i = 0; i<this.circleMenu.length; i++) {
            this.circleMenu[i].position.y += val
        }
        this.drawCharacterLines()
        this.updateTorso()
    }

    //menu methods
    openMenu( obj) {
        let this_class = this.constructor;
        var character = this;
        
        var part;
        for (var key in character) {
            if(character[key] != null && character[key].mesh != null && character[key].mesh == obj) {
                part = character[key];
                break
            }
        }

        this.makeAxisMenu(character.scene, part)

        this.gui = new GUI();
        const xFolder = this.gui.addFolder('X Axis')
        var x = { 
            AnglePos:function() {
                this_class.rotateChildrenOfObject(part, new THREE.Vector3(1, 0, 0), 10, character)
            },
            AngleNeg:function() {
                this_class.rotateChildrenOfObject(part, new THREE.Vector3(1, 0, 0), -10, character)
            }
        };
        xFolder.add(x, 'AnglePos')
        xFolder.add(x, 'AngleNeg')
        const yFolder = this.gui.addFolder('Y Axis')
        var y = { 
            AnglePos:function(){
                this_class.rotateChildrenOfObject(part, new THREE.Vector3(0, 1, 0), 10, character)
            },
            AngleNeg:function(){
                this_class.rotateChildrenOfObject(part, new THREE.Vector3(0, 1, 0), -10, character)
            }
        };
        yFolder.add(y, 'AnglePos')
        yFolder.add(y, 'AngleNeg')
        const zFolder = this.gui.addFolder('Z Axis')
        var z = { 
            AnglePos:function(){
                this_class.rotateChildrenOfObject(part, new THREE.Vector3(0, 0, 1), 10, character)
            },
            AngleNeg:function(){
                this_class.rotateChildrenOfObject(part, new THREE.Vector3(0, 0, 1), -10, character)
            }
        };
        zFolder.add(z, 'AnglePos')
        zFolder.add(z, 'AngleNeg')
        xFolder.open()
        yFolder.open()
        zFolder.open()

        const moveFolder = this.gui.addFolder('Move Character')
        var move = { 
            up:function(){
                character.moveCharacterUpOrDown(1);
            },
            down:function(){
                character.moveCharacterUpOrDown(-1);
            }
        };
        moveFolder.add(move, 'up')
        moveFolder.add(move, 'down')
    }

    closeMenu(scene) {
        this.closeAxisMenu(scene)
        if(this.gui) {
            this.gui.domElement.remove();
        }
    }

    static createCircle(scene, size, color, xR, yR, zR, x, y, z, name) {
      const geometry = new THREE.CircleGeometry( size, 100 );
      geometry.computeBoundingSphere()
      const material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.7} );
      const circle = new THREE.Mesh( geometry, material );
      circle.position.set(x, y, z)
      circle.rotation.x = xR
      circle.rotation.y = yR
      circle.rotation.z = zR
      circle.name = name
      circle.frustumCulled=false
      scene.add( circle );
      return circle
    }


    makeAxisMenu(scene, part) {
        for(var i = 0; i < this.circleMenu.length; i++) {
            scene.remove(this.circleMenu[i])
        }
        this.circleMenu = [];

        let blue = 0x0000FF;
        let red = 0xFF0000;
        let green = 0x00FF00;
        this.circleMenu.push( this.constructor.createCircle(scene, 10, blue, 0, 0, Math.PI / 2, part.mesh.position.x, part.mesh.position.y, part.mesh.position.z, 'z'))
        this.circleMenu.push( this.constructor.createCircle(scene, 10, red, 0, Math.PI / 2, 0, part.mesh.position.x, part.mesh.position.y, part.mesh.position.z, 'x'))
        this.circleMenu.push( this.constructor.createCircle(scene, 10, green, Math.PI / 2, 0, 0, part.mesh.position.x, part.mesh.position.y, part.mesh.position.z, 'y'))
    }

    closeAxisMenu() {
        var scene = this.scene
        for(var i = 0; i<this.circleMenu.length; i++) {
            scene.remove(this.circleMenu[i])
        }
        this.circleMenu = [];
    }

    posHelper(pos) {
        return new THREE.Vector3(pos.x, pos.y, pos.z)
    }

    getPlayerJointPositions() {
        return {
            'left_foot': new THREE.Vector3(this.left_foot.mesh.position.x, this.left_foot.mesh.position.y, this.left_foot.mesh.position.z),
            'right_foot': new THREE.Vector3(this.right_foot.mesh.position.x, this.right_foot.mesh.position.y, this.right_foot.mesh.position.z),
            'left_knee': new THREE.Vector3(this.left_knee.mesh.position.x, this.left_knee.mesh.position.y, this.left_knee.mesh.position.z),
            'right_knee': new THREE.Vector3(this.right_knee.mesh.position.x, this.right_knee.mesh.position.y, this.right_knee.mesh.position.z),
            'left_hip': new THREE.Vector3(this.left_hip.mesh.position.x, this.left_hip.mesh.position.y, this.left_hip.mesh.position.z),
            'right_hip': new THREE.Vector3(this.right_hip.mesh.position.x, this.right_hip.mesh.position.y, this.right_hip.mesh.position.z),
            'torso': new THREE.Vector3(this.torso.mesh.position.x, this.torso.mesh.position.y, this.torso.mesh.position.z),
            'left_shoulder': new THREE.Vector3(this.left_shoulder.mesh.position.x, this.left_shoulder.mesh.position.y, this.left_shoulder.mesh.position.z),
            'right_shoulder': new THREE.Vector3(this.right_shoulder.mesh.position.x, this.right_shoulder.mesh.position.y, this.right_shoulder.mesh.position.z),
            'left_elbow': new THREE.Vector3(this.left_elbow.mesh.position.x, this.left_elbow.mesh.position.y, this.left_elbow.mesh.position.z),
            'right_elbow': new THREE.Vector3(this.right_elbow.mesh.position.x, this.right_elbow.mesh.position.y, this.right_elbow.mesh.position.z),
            'left_hand': new THREE.Vector3(this.left_hand.mesh.position.x, this.left_hand.mesh.position.y, this.left_hand.mesh.position.z),
            'right_hand': new THREE.Vector3(this.right_hand.mesh.position.x, this.right_hand.mesh.position.y, this.right_hand.mesh.position.z),
            'neck': new THREE.Vector3(this.neck.mesh.position.x, this.neck.mesh.position.y, this.neck.mesh.position.z),
            'head': new THREE.Vector3(this.head.mesh.position.x, this.head.mesh.position.y, this.head.mesh.position.z)
        }
    }

    changePartPos(mesh, position) {
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;
    }

    applyNewPlayerPosition(newPositions) {
        // this.closeMenu()
        this.changePartPos(this.left_foot.mesh, newPositions['left_foot'])
        this.changePartPos(this.right_foot.mesh, newPositions['right_foot'])
        this.changePartPos(this.left_knee.mesh, newPositions['left_knee'])
        this.changePartPos(this.right_knee.mesh, newPositions['right_knee'])
        this.changePartPos(this.left_hip.mesh, newPositions['left_hip'])
        this.changePartPos(this.right_hip.mesh, newPositions['right_hip'])
        this.changePartPos(this.torso.mesh, newPositions['torso'])
        this.changePartPos(this.left_shoulder.mesh, newPositions['left_shoulder'])
        this.changePartPos(this.right_shoulder.mesh, newPositions['right_shoulder'])
        this.changePartPos(this.left_elbow.mesh, newPositions['left_elbow'])
        this.changePartPos(this.right_elbow.mesh, newPositions['right_elbow'])
        this.changePartPos(this.left_hand.mesh, newPositions['left_hand'])
        this.changePartPos(this.right_hand.mesh, newPositions['right_hand'])
        this.changePartPos(this.neck.mesh, newPositions['neck'])
        this.changePartPos(this.head.mesh, newPositions['head'])

        this.drawCharacterLines()
        this.updateTorso()
    }
}




