import * as THREE from '/build/three.module.js';

export default class Helper {

    static toScreenPosition(pos, camera) {
            var w = window.innerWidth;
            var h = window.innerHeight;

            var vector = pos.project(camera);
    
            vector.x = (vector.x + 1) / 2 * w;
            vector.y = -(vector.y - 1) / 2 * h;
    
            return vector;
    };

}
 