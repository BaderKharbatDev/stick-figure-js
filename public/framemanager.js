
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

        let frame_max_seconds = 10
        let frame_rate = 24
        for(var s = 0; s < frame_max_seconds; s++) {
            for(var f = 0; f < frame_rate; f++) {
                this.frames.push(null)
            }
        }
        this.frames[0] = character.getPlayerJointPositions()
        this.adjustedFrames = [character.getPlayerJointPositions()]
        FrameManager.instance=this;
    }

    static getInstance(character) {
        if (!FrameManager.instance) {
            FrameManager.instance=new FrameManager(character);
        }
        return FrameManager.instance;
    }

    saveCurrentKeyFrame() {
        this.frames[this.frame_index] = this.character.getPlayerJointPositions()
    }

    moveToDifferentKeyFrame(index) {
        this.saveCurrentKeyFrame()
        this.frame_index = index
    }

    play() {
        //turn frames into adjusted frames 1st by judging the best positions

        this.playing = true;
    }

    saveAnimation() {
        //turns frames into adjusted frames again and saves it to a json file
    }


}