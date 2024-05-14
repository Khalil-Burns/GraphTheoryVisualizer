var algSelect;
var settingsPopup;
var alg = null;
var prevTime;
var curTime;
var dTime;
var errorMessage;

function buttonScriptStart() {
    algSelect = document.getElementById('algorithms-select');
    dTime = document.getElementById('algorithm-speed');
    settingsPopup = document.getElementById('animation-settings-popup');
    errorMessage = document.getElementById('error-message');
}

function resetNodes() {
    for (node in nodes) {
        nodes[node].delete();
    }
    nodesNum = 0;
}
function runAlgorithm() {
    errorMessage.innerHTML = ''
    if (!curSelected) {
        errorMessage.innerHTML = 'Please select a starting node'
        return;
    }
    if (!Algorithm.running) {
        alg = new Algorithm(algSelect.value);
        Algorithm.running = true;
        prevTime = new Date().getTime();
    }
    else {
        errorMessage.innerHTML = 'Algorithm Already Running'
    }
}
function pauseAlgorithm() {
    errorMessage.innerHTML = ''
}
function stopAlgorithm() {
    errorMessage.innerHTML = ''
    alg.complete = true;
}
function stepHandler() {
    if (Algorithm.running) {
        if (alg.isComplete()) {
            Algorithm.running = false;
            errorMessage.innerHTML = ''
            return;
        }

        curTime = new Date().getTime();
        if (curTime - prevTime >= dTime.value) {
            alg.step();
            prevTime = curTime;
        }
    }
}

function showAddSettingsPopup() {
    if (settingsPopup.showing) {
        settingsPopup.style.animationName = 'hideAddSettingsPopup'
        settingsPopup.style.animationDuration = '0.5s'
        // addAllergiesButton.style.animationName = 'rotateAddAllergiesButtonHide'
        // addAllergiesButton.style.animationDuration = '0.5s'
        delete settingsPopup.showing
    }
    else {
        settingsPopup.showing = true;
        settingsPopup.style.animationName = 'showAddSettingsPopup'
        settingsPopup.style.animationDuration = '0.5s'
        // addAllergiesButton.style.animationName = 'rotateAddAllergiesButtonShow'
        // addAllergiesButton.style.animationDuration = '0.5s'
    }
}