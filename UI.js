import {EoFinder} from "./EoFinder.js";
import { EoFormatter } from "./EoFormatter.js";
import {EoMatcher} from "./EoMatcher.js";
import {ScrambleGenerator} from "./ScambleGenerator.js";

let attemptInProgress = false;
let startTime;
let stopTime;

function formatTime(timer) {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

function invert(eo) {
    if(eo.includes("(") && document.getElementById("ignore-inverse-toggle").checked) {
        return eo;
    }
    let normal = EoFormatter.getNormalPortion(eo);
    let inverse = EoFormatter.getInversePortion(eo);
    if(normal == "") return inverse;
    return inverse + "(" + normal + ")";
}

function loadSettings() {
    document.querySelectorAll(".settings-field").forEach(elem => {
        const savedValue = localStorage.getItem(elem.id);
        if(savedValue === null) return;

        if(elem.type === "checkbox") {
            elem.checked = savedValue === "true";
        } else {
            elem.value = savedValue;
        }

        const event = new Event('input', { bubbles: true });
        elem.dispatchEvent(event);
    });
}

function setToDefault(event){
    if(event.srcElement.id === "timer-default" || event.srcElement.id == "all-default"){
        document.getElementById("time-limit-m").value = "10";
        document.getElementById("time-limit-s").value = "00";
        document.getElementById("show-extra-time").checked = false;
        document.getElementById("extra-time-amt").value = 30;
    }
    if(event.srcElement.id === "entry-default" || event.srcElement.id == "all-default"){
        document.getElementById("clear-eo").checked = false;
        document.getElementById("allow-invalid").checked = true;
        document.getElementById("allow-long").checked = false;
        document.getElementById("allow-duplicate").checked = false;
        document.getElementById("ignore-inverse-toggle").checked = true;
    }
    if(event.srcElement.id === "scramble-default" || event.srcElement.id == "all-default"){
        document.getElementById("use-custom-scramble").checked = false;
        document.getElementById("toggle-inverse-image").checked = false;
        document.getElementById("scramble-view-mode").value = "2d";
    } 

    document.querySelectorAll(".settings-field").forEach(elem => {
        const input = new Event('input', { bubbles: true });
        elem.dispatchEvent(input);
    });
}

function getFoundEoDiv(eo, eoMatcher){
    const eoDiv = document.createElement("div");
    const movesDiv = document.createElement("div");
    movesDiv.innerHTML = eo;
    eoDiv.id = eo;
    eoDiv.className = "found-eo-div eo-div";
    eoDiv.appendChild(movesDiv);
    if(document.getElementById("allow-invalid").checked) {
        const deleteEo = document.createElement("span");
        deleteEo.addEventListener('click', function() {
            if(!attemptInProgress) return;
            eoMatcher.removeEo(eo);
            eoDiv.style.display = "none";
        });
        deleteEo.classList.add("close");
        deleteEo.classList.add("delete-eo");
        deleteEo.innerHTML = '&times';
        eoDiv.appendChild(deleteEo);
    }
    return eoDiv;
}

function getMissedEoDiv(eo){
    const eoDiv = document.createElement("div");
    eoDiv.id = eo
    eoDiv.innerHTML = eo;
    eoDiv.className = "eo-div";
    return eoDiv;
}

function displayEos(eoMatcher) {
    const missedEosSpan = document.getElementById("missed-eos");
    missedEosSpan.innerHTML = "";
    const maxEoLength = document.getElementById("moves-slider").value;
    const showNormal = document.getElementById("normal-filter").checked;
    const showInverse = document.getElementById("inverse-filter").checked;
    const showNiss = document.getElementById("niss-filter").checked;
    const showFB = document.getElementById("axis-filter-fb").checked;
    const showRL = document.getElementById("axis-filter-rl").checked;
    const showUD = document.getElementById("axis-filter-ud").checked;

    const hiddenEos = [];
    const shownEos = [];
    for(const eo of eoMatcher.getMissedEos()) {
        const hideEo = EoFormatter.getEoLength(eo) > maxEoLength ||
        !showNormal && EoFormatter.isNormalEo(eo) ||
        !showInverse && EoFormatter.isInverseEo(eo) ||
        !showNiss && EoFormatter.isNissEo(eo) ||
        !showFB && EoFormatter.isEoFB(eo) || 
        !showRL && EoFormatter.isEoRL(eo) ||
        !showUD && EoFormatter.isEoUD(eo);
        const eoDiv = getMissedEoDiv(eo);
        if(hideEo) {
            eoDiv.style.visibility = "hidden";
            hiddenEos.push(eoDiv);
        } else {
            shownEos.push(eoDiv);
        }
    }
    shownEos.forEach(eoDiv => missedEosSpan.appendChild(eoDiv));
    hiddenEos.forEach(eoDiv => missedEosSpan.appendChild(eoDiv));
}

function displayResults(eoMatcher) {
    stopTime = Date.now();
    const report = document.getElementById('report');
    report.style.visibility = 'visible';
    const foundEos = eoMatcher.getFoundEos();
    const missedEos = eoMatcher.getMissedEos();
    displayEos(eoMatcher);
    const foundEosNumSpan = document.getElementById("eos-found-num");
    foundEosNumSpan.innerHTML = foundEos.length;
    const timeTakenSpan = document.getElementById("time-taken");
    timeTakenSpan.innerHTML = formatTime(Math.round((stopTime - startTime) / 1000))
    const missedEosNumSpan = document.getElementById("missed-eos-num");
    missedEosNumSpan.innerHTML = missedEos.length;
    const wrongEosReportSpan = document.getElementById("wrong-eos-report");
    if(document.getElementById("allow-invalid").checked) {
        wrongEosReportSpan.style.display = "inline";
        const wrongEosNumSpan = document.getElementById("wrong-eos-num");
        wrongEosNumSpan.innerHTML = eoMatcher.getWrongEos().length;
        for(const deleteButton of document.getElementsByClassName("delete-eo")) {
            deleteButton.style.display = "none";
        }
    }
    if(document.getElementById("allow-duplicate").checked) {
        for(const eoDiv of document.getElementsByClassName("found-eo-div")) {
            eoDiv.style.display = "none";
        }
        for(const eo of eoMatcher.getFoundEos()) {
            const eoDiv = document.getElementById(eo);
            eoDiv.style.display = "inline";
        }
    }
    for(const eo of eoMatcher.getWrongEos()) {
        const eoDiv = document.getElementById(eo);
        eoDiv.style.display = "flex";
        eoDiv.style.backgroundColor = "#ff3636";
        eoDiv.style.borderColor = "#661515";
    }
    report.scrollIntoView({block: "start", inline: "nearest", behavior:"smooth"});
};

function startTimer(duration, display, eoMatcher) {
    var timer = duration;
    startTime = Date.now(); 
    display.textContent = formatTime(timer);
    let intervalId = setInterval(function () {
        if(timer > 0) {
            timer--;
        } else {
            attemptInProgress = false;
            displayResults(eoMatcher);
            clearInterval(intervalId);
            return;
        }
        display.textContent = formatTime(timer);
    }, 1000);
    const extraTimeBtn = document.getElementById("extra-time-btn");
    extraTimeBtn.addEventListener('click', function() {
        if(!attemptInProgress) return;
        timer += parseInt(localStorage.getItem("extra-time-amt"));
        display.textContent = formatTime(timer);
    });
    return intervalId;
}

function resetUI() {
    const error = document.getElementById("error-msg");
    error.innerHTML = "";
    const foundEosP = document.getElementById("list-eos-found");
    foundEosP.innerHTML = "";
    const foundEosNumSpan = document.getElementById("eos-found-num");
    foundEosNumSpan.innerHTML = "";
    const missedEosSpan = document.getElementById("missed-eos");
    missedEosSpan.innerHTML = "";
    const report = document.getElementById('report');
    report.style.visibility = 'hidden';
    const display = document.getElementById("time-left");
    display.innerHTML = document.getElementById("time-limit-m").value + ":" + document.getElementById("time-limit-s").value;
    const inverseCheckBox = document.getElementById("inverse");
    inverseCheckBox.checked = false;
    const eoEntryBox = document.getElementById("entered-eo");
    eoEntryBox.value = "";
}

async function main() {
    let sg = new ScrambleGenerator();
    let eoFinder;
    let eoMatcher;
    let intervalId;
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", async function() {
        startBtn.innerHTML = "Loading...";
        startBtn.disabled = true;
        await new Promise(resolve => setTimeout(resolve, 0));
        resetUI();
        try{
            clearInterval(intervalId);
        } catch {}
        attemptInProgress = true;
        const customScrambleCheck = document.getElementById("use-custom-scramble");
        const customScrambleEntry = document.getElementById("scramble-entry");
        let scram;
        if (customScrambleCheck.checked && 
            document.getElementById("scramble-error-msg").innerHTML != "Invalid scramble") {
            scram = EoFormatter.formatEo(customScrambleEntry.value); //this works for scrambles too ig
        } else {
            scram = sg.getPaddedScramble();
        }
        eoFinder = new EoFinder(scram);
        const foundEos = await eoFinder.findAllSub5EosRecursive();
        eoMatcher = new EoMatcher(foundEos);
        document.getElementById("scramble-string").innerHTML = scram;
        document.getElementById("normal-scramble-view").setAttribute("alg", scram);
        document.getElementById("inverse-scramble-view").setAttribute("alg", Cube.inverse(scram));
        document.getElementById("scramble-entry").style.display = "none";
        document.getElementById("scramble-error-msg").style.display = "none";
        startBtn.disabled = false;
        startBtn.innerHTML = "Start";
        let minutes = document.getElementById("time-limit-m").value;
        let seconds = document.getElementById("time-limit-s").value;
        var timer = 0;
        try {
            timer += parseInt(minutes) * 60;
        } catch {}
        try {
            timer += parseInt(seconds);
        } catch {}
        const display = document.getElementById("time-left");
        intervalId = startTimer(timer, display, eoMatcher);        
    });

    const endBtn = document.getElementById("end-btn");
    endBtn.addEventListener("click", async function() {
        if(!attemptInProgress) return;
        try{
            clearInterval(intervalId);
            displayResults(eoMatcher);
            attemptInProgress = false;
            if(document.getElementById("use-custom-scramble").checked) {    
                document.getElementById("scramble-string").innerHTML = "Enter scramble below";
                document.getElementById("scramble-entry").style.display = "";
                document.getElementById("scramble-error-msg").style.display = "";
            }
        } catch {}
    });

    const eoInputField = document.getElementById("entered-eo");
    eoInputField.addEventListener('keydown', function(event) {
        const allowInvalid = document.getElementById("allow-invalid").checked;
        const allowDuplicate = document.getElementById("allow-duplicate").checked;
        const allowLong = document.getElementById("allow-long").checked;

        const error = document.getElementById("error-msg");
        const addFoundEo = function(eo){
            const foundEosDiv = document.getElementById("list-eos-found");
            foundEosDiv.appendChild(getFoundEoDiv(eo, eoMatcher));
            error.innerHTML = "";
            if(document.getElementById("clear-eo").checked) eoInputField.value = "";
        };

        if (event.key === 'Enter') {
            event.preventDefault();
            if(!attemptInProgress) return;
            error.innerHTML = "";
            let eo = document.getElementById("inverse").checked ? invert(eoInputField.value) : eoInputField.value;
            eo = eo.toUpperCase();
            if(!EoFormatter.checkValidString(eo)) {
                error.innerHTML = "Invalid string";
                return;
            }
            eo = EoFormatter.formatEo(eo).trim();
            if(EoFormatter.countMoves(eo) > 5) {
                if(!allowLong) error.innerHTML = "EO greater than 5 moves";
                else if(!eoFinder.isEo(eo)) {
                    if(!allowInvalid) {
                        error.innerHTML = "Invalid EO";
                    } else {
                        eoMatcher.addWrongEo(eo);
                        addFoundEo(eo);
                    }
                } else if (!allowDuplicate && eoMatcher.getFoundEos().includes(eo)){
                        error.innerHTML = "EO already found";
                } else {
                    eoMatcher.addExtraEo(eo);
                    addFoundEo(eo);
                }
            }
            else if(eoMatcher.checkIfFoundEo(eo) && !allowDuplicate) {
                error.innerHTML = "EO already found";
            } else if (!eoMatcher.checkIfEo(eo)){
                if(!allowInvalid) {
                    error.innerHTML = "Invalid EO";
                } else if (!allowDuplicate && eoMatcher.getWrongEos().includes(eo)) {
                    error.innerHTML = "EO already found";
                } else {
                    eoMatcher.addWrongEo(eo);
                    addFoundEo(eo);
                }
            } else {
                addFoundEo(eo);
            }
        }
    });

    const extraTimeCheck = document.getElementById("show-extra-time");
    const extraTimeBtn = document.getElementById("extra-time-btn");
    const extraTimeAmt = document.getElementById("extra-time-amt");
    extraTimeAmt.addEventListener('change', function() {
        extraTimeBtn.innerHTML = "+" + localStorage.getItem("extra-time-amt") + "s";
    })
    extraTimeCheck.addEventListener('input', function() {
        if(extraTimeCheck.checked) {
            extraTimeBtn.style.display = "inline";
        } else {
            extraTimeBtn.style.display = "none";
        }
    });

    const timeLimitM = document.getElementById("time-limit-m");
    const timeLimitS = document.getElementById("time-limit-s");
    const timeLeft = document.getElementById("time-left");
    const handleUpdateTime = function() {
        let minutes = timeLimitM.value;
        let seconds = timeLimitS.value;
        var timer = 0;
        try {
            timer += parseInt(minutes) * 60;
        } catch {}
        try {
            timer += parseInt(seconds);
        } catch {}
        timeLeft.textContent = formatTime(timer);
    }
    timeLimitM.addEventListener('change', handleUpdateTime);
    timeLimitS.addEventListener('change', handleUpdateTime);
    
    const showInverseCheck = document.getElementById("toggle-inverse-image");
    showInverseCheck.addEventListener('input', function() {
        if(showInverseCheck.checked) {
            document.getElementById("normal-scramble-title").style.visibility = "visible";
            document.getElementById("inverse-scramble").style.display = "";
        } else {
            document.getElementById("normal-scramble-title").style.visibility = "hidden";
            document.getElementById("inverse-scramble").style.display = "none";
        }
    });

    const scrambleViewSelector = document.getElementById("scramble-view-mode");
    scrambleViewSelector.addEventListener('input', function(event) {
        if(event.target.value == "2d") {
            document.getElementById("normal-scramble-view").setAttribute("visualization", "2D");
            document.getElementById("inverse-scramble-view").setAttribute("visualization", "2D");
        } else {
            document.getElementById("normal-scramble-view").setAttribute("visualization", "3D");
            document.getElementById("inverse-scramble-view").setAttribute("visualization", "3D");
        }
    });

    const customScrambleCheck = document.getElementById("use-custom-scramble");
    customScrambleCheck.addEventListener('input', function() {
        if(attemptInProgress) return;
        if(customScrambleCheck.checked) {
            document.getElementById("scramble-string").innerHTML = "Enter scramble below";
            document.getElementById("scramble-entry").style.display = "";
            document.getElementById("scramble-error-msg").style.display = "";
        } else {
            document.getElementById("scramble-string").innerHTML = "";
            document.getElementById("scramble-entry").style.display = "none";
            document.getElementById("scramble-error-msg").style.display = "none";
        }
    });
    
    const customScrambleEntry = document.getElementById("scramble-entry");
    customScrambleEntry.addEventListener('input', function() {
        if(attemptInProgress) return;
        const alg = customScrambleEntry.value;
        try{    
            let cube = new Cube();
            cube.move(alg); //check validity
            document.getElementById("normal-scramble-view").setAttribute("alg", alg);
            document.getElementById("inverse-scramble-view").setAttribute("alg", Cube.inverse(alg));
            document.getElementById("scramble-error-msg").innerHTML = "";
        } catch {
            document.getElementById("scramble-error-msg").innerHTML = "Invalid scramble";
        };
    });

    const maxMoveCount = document.getElementById("moves-slider");
    maxMoveCount.addEventListener('input', () => {
        document.getElementById("moves-slider-value").innerHTML = maxMoveCount.value;
        displayEos(eoMatcher);
    });
    const showNormal = document.getElementById("normal-filter");
    showNormal.addEventListener('input', () => displayEos(eoMatcher));
    const showInverse = document.getElementById("inverse-filter");
    showInverse.addEventListener('input', () => displayEos(eoMatcher));
    const showNiss = document.getElementById("niss-filter");
    showNiss.addEventListener('input', () => displayEos(eoMatcher));
    const showFB = document.getElementById("axis-filter-fb");
    showFB.addEventListener('input', () => displayEos(eoMatcher));
    const showRL = document.getElementById("axis-filter-rl");
    showRL.addEventListener('input', () => displayEos(eoMatcher));
    const showUD = document.getElementById("axis-filter-ud");
    showUD.addEventListener('input', () => displayEos(eoMatcher));

    const settingsModalBtn = document.getElementById("settings-button");
    const helpModalBtn = document.getElementById("help-button");
    const modalTitle = document.getElementById("modal-title");
    const modalXBtn = document.getElementById("x-modal");
    const modalCloseBtn = document.getElementById("close-modal");
    const modal = document.getElementById("hs-modal");
    const settingsContent = document.getElementById("settings-modal");
    const helpContent = document.getElementById("help-modal");

    settingsModalBtn.addEventListener('click', function(event) {
        modal.style.display = "block";
        settingsContent.style.display = "inline";
        helpContent.style.display = "none";
        modalTitle.innerHTML = "Settings";
    });

    helpModalBtn.addEventListener('click', function(event) {
        modal.style.display = "block";
        settingsContent.style.display = "none";
        helpContent.style.display = "inline";
        modalTitle.innerHTML = "About";
    });
    
    modalXBtn.addEventListener('click', function(event) {
        modal.style.display = "none";
    })
    
    modalCloseBtn.addEventListener('click', function(event) {
        modal.style.display = "none";
    })

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.body.addEventListener('keydown', function(e){
        if (e.key == "Escape") modal.style.display = "none";
    });

    document.querySelectorAll(".settings-field").forEach(elem => {
        elem.addEventListener("input", event => {
            let value;
            if (elem.type === "checkbox") {
                value = elem.checked;
            } else if (elem.tagName === "SELECT") {
                value = elem.value;
            } else {
                value = elem.value;
            }
            localStorage.setItem(elem.id, value);
        });
    });

    document.querySelectorAll(".tl").forEach(elem => {
        elem.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D+/g, '');
        });
    });

    document.querySelectorAll(".default").forEach(elem => {
        elem.addEventListener("click", (e) => {
            setToDefault(e);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
});
main();
