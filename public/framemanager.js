const frame_div = document.getElementById('frame-bar')
const current_key_frame_color = '#FFFF00';
const saved_key_frame_color = '#808080';
const unsaved_key_frame_color = '#ffffff';

class Frame {
    constructor(character_positions) {
        this.positions = character_positions
    }
}

export default class FrameManager {
    constructor(character) {
        this.character = character
        this.frame_index = 0;
        this.currentFrameBeingEdited = 0;
        this.playing = false;
        this.frames = [];
        this.buttons = [];
        //
        let frame_max_seconds = 10
        let frame_rate = 24
        let b;
        let this_class = this
        for(var s = 0; s < frame_max_seconds; s++) {
            for(var f = 0; f < frame_rate; f++) {
                this.frames.push(null)
                b = document.createElement('button');
                if(f == 0) {
                    b.innerHTML = s + 's'
                }
                let ind = this_class.frames.length - 1
                b.onclick = function() {
                    this_class.moveToDifferentKeyFrame(ind)
                }
                frame_div.appendChild(b)
                this.buttons.push(b)
            }
        }
        this.frames.push(null)
        b = document.createElement('button');
        b.innerHTML = '10s'
        frame_div.appendChild(b)
        this.buttons.push(b)
        //
        this.adjustedFrames = [];
        this.saveCurrentKeyFrame();
        FrameManager.instance=this;
    }

    static getInstance(character) {
        if (!FrameManager.instance) {
            FrameManager.instance=new FrameManager(character);
        }
        return FrameManager.instance;
    }

    saveCurrentKeyFrame() {
        this.frames[this.currentFrameBeingEdited] = this.character.getPlayerJointPositions()
    }

    moveToDifferentKeyFrame(index) {
        this.buttons[this.currentFrameBeingEdited].style.background = saved_key_frame_color;
        this.saveCurrentKeyFrame()
        this.currentFrameBeingEdited = index
        this.buttons[this.currentFrameBeingEdited].style.background = current_key_frame_color;
    }

    play() {
        //turn frames into adjusted frames 1st by judging the best positions

        this.playing = true;
    }

    saveAnimation() {
        //turns frames into adjusted frames again and saves it to a json file
    }


}