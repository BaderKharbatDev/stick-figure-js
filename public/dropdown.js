import PlayerManager from '/playermanager.js'
var playerManager = PlayerManager.getInstance()
var dd = document.getElementById("myDropdown")
dd.classList.toggle("show");
var tl = document.getElementById('trick_list')
var ddt = document.getElementById('dropdown')
ddt.onkeyup = filterFunction
document.getElementById('menu').onclick = hideOptions
document.getElementById('mainMenu').onclick = hideOptions

function hideOptions() {
    var div = document.getElementById("myDropdown");
    var a = div.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        a[i].style.display = "none";
    }
    ddt.value = '';
}
    
function filterFunction() {
    var div, txtValue, input, filter, ul, li, a, i;
    input = document.getElementById("dropdown");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
        } else {
        a[i].style.display = "none";
        }
    }
} 

var arr = [], l = document.links;
for(var i=0; i<l.length; i++) {
  l[i].onclick = function() {
    hideOptions()
  }
}

var tricks_json = {
    "Aerial": './tricks/darkside_aerial.json',
    "Backstep": './tricks/darkside_backstep.json',
    "Frontstep": './tricks/darkside_frontstep.json',
    "Backhand Spring": './tricks/darkside_backhandspring.json',
    "Backhand Spring Step Out": './tricks/darkside_backhandspring_stepout.json',
    "Btwist": './tricks/darkside_btwist.json',
    "Cartwheel": './tricks/darkside_cartwheel.json',
    "Cheat Gainer": './tricks/darkside_cheatgainer.json',
    "Cheat 9": './tricks/darkside_c9.json',
    "Cheat 7": '/tricks/darkside_c7.json',
    "Cork": './tricks/darkside_cork.json',
    "Master Scoot": './tricks/darkside_masterscoot.json',
    "Flashkick": './tricks/darkside_flashkick.json',
    "Full": './tricks/darkside_full.json',
    "Gainer Switch": './tricks/darkside_gainerswitch.json',
    "Hook Kick": './tricks/darkside_hook.json',
    "Raiz": './tricks/darkside_raiz.json',
    "Round Kick": './tricks/darkside_round.json',
    "Scoot": './tricks/darkside_scoot.json',
    "Step Over Hook": './tricks/darkside_step_over_hook.json',
    "TDR": './tricks/darkside_tdr.json',
    "Tornado": './tricks/darkside_tornado.json',
    "540": './tricks/darkside_540.json'
}

for (let key in tricks_json) {
    if (tricks_json.hasOwnProperty(key)) {           
        let a = document.createElement("a");
        a.innerHTML = key
        a.onclick = function() {
            let p = document.createElement('li')
            p.innerHTML = key
            tl.appendChild(p)

            fetch(tricks_json[key]).then(function(response) {
                return response.json();
            }).then(function(data) {
                playerManager.addAnimation(data)
            })

            hideOptions()
        }
        dd.appendChild(a)
    }
}

hideOptions()
