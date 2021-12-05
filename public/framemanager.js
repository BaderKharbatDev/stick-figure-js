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
        let frame_rate = 30
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
        this.moveToDifferentKeyFrame(0);
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
        if(this.frames[this.currentFrameBeingEdited] != null) {
            this.character.applyNewPlayerPosition(this.frames[this.currentFrameBeingEdited])
        } else {
            //make character position the last available non-null frame

            var last_char_pos = this.currentFrameBeingEdited
            while( this.frames[last_char_pos] == null) {
                last_char_pos -= 1;
            }
            this.character.applyNewPlayerPosition(this.frames[last_char_pos])
        }
    }

    play() {
        this.saveCurrentKeyFrame()
        var last_ind = 0;
        for(var i = 0; i < this.frames.length; i++) {
            if(this.frames[i] == null) {
                break;
            } else {
                last_ind = i;
            }
        }
        this.moveToDifferentKeyFrame(last_ind)

        //turn frames into adjusted frames 1st by judging the best positions
        this.playing = true;
    }

    saveAnimation() {
        this.adjustFrames()
        this.#downloadObjectAsJson(this.adjustedFrames, 'animation')
    }

    #downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }

    adjustFrames() {
        this.adjustedFrames = [];
        //turns frames into adjusted frames again and saves it to a json file
        for(var i = 0; i < this.frames.length; i++) {
            if(this.frames[i] != null) {
                this.adjustedFrames.push(this.frames[i])
            } else {
                // break
            }
        }
    }

    removeCurrentFrame() {
        if(this.currentFrameBeingEdited != 0) {
            this.frames[this.currentFrameBeingEdited] = null
            this.buttons[this.currentFrameBeingEdited].style.background = unsaved_key_frame_color;

            var last_char_pos = this.currentFrameBeingEdited
            while( this.frames[last_char_pos] == null) {
                last_char_pos -= 1;
            }

            this.character.applyNewPlayerPosition(this.frames[last_char_pos])
            this.currentFrameBeingEdited = last_char_pos
            this.buttons[this.currentFrameBeingEdited].style.background = current_key_frame_color;
        }
        
    }

    //TO-DO
    static generatePositionBetweenTwoFrames(frame1, frame2) {
        var inbetweenFrames = []
        //maybe use like 5 frames for transitions? or make it depending on distance?
        
    }


}