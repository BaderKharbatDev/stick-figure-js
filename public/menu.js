import Character from '/character.js';
import Helper from './helper.js'
import FrameManager from '/framemanager.js'

var frameManager = FrameManager.getInstance()
window['globalvars'] = {};
window['globalvars'].isAnimating = false;

function getStyle(id, name) {
    var element = document.getElementById(id);
    return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
}

function toggleDiv(id) {
    var x = document.getElementById(id);
    var display = getStyle(id, 'display');

    if (display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
} 

function toggleMenus() {
    toggleDiv('mainMenu')
    toggleDiv('newMenu')
    toggleDiv('frame-bar')

    if(getStyle('newMenu', 'display') == 'none') {
        window['globalvars'].isAnimating = false;
    } else {
        window['globalvars'].isAnimating = true;
    }
    if(getStyle('frame-bar', 'display') == 'block') {
        document.getElementById('frame-bar').style.display = 'flex'
    }
}

const newMenuButton = document.getElementById('new-menu-b')
newMenuButton.onclick = toggleMenus;
const menuButton = document.getElementById('back-b');
menuButton.onclick = toggleMenus;

document.addEventListener('keydown', function(event){
    if(event.keyCode == 78) {
        if(frameManager.currentFrameBeingEdited != frameManager.frames.length - 1) {
            frameManager.moveToDifferentKeyFrame(frameManager.currentFrameBeingEdited + 1)
        }
    }
    if(event.keyCode == 80) {
        frameManager.play()
    }
} );

document.getElementById('play_b').onclick = function() {
    frameManager.play()
}

document.getElementById('next_b').onclick = function() {
    if(frameManager.currentFrameBeingEdited != frameManager.frames.length - 1) {
        frameManager.moveToDifferentKeyFrame(frameManager.currentFrameBeingEdited + 1)
    }
}

document.getElementById('save_b').onclick = function() {
    frameManager.saveAnimation()
}
