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

    if(getStyle('newMenu', 'display') == 'none') {
        window['globalvars'].isAnimating = false;
    } else {
        window['globalvars'].isAnimating = true;
    }
}

const newMenuButton = document.getElementById('new-menu-b')
newMenuButton.onclick = toggleMenus;
const menuButton = document.getElementById('back-b');
menuButton.onclick = toggleMenus;


