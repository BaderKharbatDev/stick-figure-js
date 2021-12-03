export default class PlayerManager {
    constructor() {
        this.frames = [];
        this.playing = false;
        this.frame_index = 0;
        this.speed = 1.0
        PlayerManager.instance=this;
    }

    static getInstance(character) {
        if (!PlayerManager.instance) {
            PlayerManager.instance=new PlayerManager(character);
        }
        return PlayerManager.instance;
    }

    addAnimation(frames) {
        for(var i = 0; i < frames.length; i++) {
            this.frames.push(frames[i])
        }
        console.log(this.frames.length)
    }

    play() {
        this.playing = true;
    }
}