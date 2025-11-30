import {EoFinder} from "./EoFinder.js";
import { EoFormatter } from "./EoFormatter.js";
import {EoMatcher} from "./EoMatcher.js";
import {ScrambleGenerator} from "./ScambleGenerator.js";

/*
TODO
 
- Prevent entering EOs after timer finished
- Accept EOs ending in F'
- Make Report and EOs found look less shitty
- Style UI a bit
*/

let attemptInProgress = false;

function invert(eo) {
    if(eo.includes("(") && document.getElementById("ignore-inverse-toggle").checked) {
        return eo;
    }
    let normal = EoFormatter.getNormalPortion(eo);
    let inverse = EoFormatter.getInversePortion(eo);
    if(normal == "") return inverse;
    return inverse + "(" + normal + ")";
}

function getEoDiv(eo){
    const eoDiv = document.createElement("div");
    eoDiv.innerHTML = eo;
    eoDiv.style.borderColor = "black";
    eoDiv.style.borderWidth = "1px";
    eoDiv.style.padding = "2px";
    return eoDiv
}

function displayEos(missedEOs) {
    const missedEosSpan = document.getElementById("missed-eos");
    missedEosSpan.innerHTML = "";
    const maxEoLength = document.getElementById("moves-slider").value;
    const showInverse = document.getElementById("inverse-filter").checked;
    const showNiss = document.getElementById("niss-filter").checked;
    const showFB = document.getElementById("axis-filter-fb").checked;
    const showRL = document.getElementById("axis-filter-rl").checked;
    const showUD = document.getElementById("axis-filter-ud").checked;
    missedEOs.filter((eo) => {
        if(EoFormatter.getEoLength(eo) > maxEoLength) return false;
        if(!showInverse && EoFormatter.isInverseEo(eo)) return false;
        if(!showNiss && EoFormatter.isNissEo(eo)) return false;
        if(!showFB && EoFormatter.isEoFB(eo)) return false;
        if(!showRL && EoFormatter.isEoRL(eo)) return false;
        if(!showUD && EoFormatter.isEoUD(eo)) return false;
        return true;
    }).forEach(eo => missedEosSpan.appendChild(getEoDiv(eo)));
}

function displayResults(eoMatcher) {
    const report = document.getElementById('report');
    report.style.visibility = 'visible';
    const foundEos = eoMatcher.getFoundEos();
    const missedEos = eoMatcher.getMissedEos();
    displayEos(missedEos);
    const foundEosNumSpan = document.getElementById("eos-found-num");
    foundEosNumSpan.innerHTML = foundEos.length;
    const missedEosNumSpan = document.getElementById("missed-eos-num");
    missedEosNumSpan.innerHTML = missedEos.length;
};

function startTimer(duration, display, eoMatcher) {
    var timer = duration, minutes, seconds;
    let intervalId = setInterval(function () {
        if(timer > 0) {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;
            timer--;
        } else {
            attemptInProgress = false;
            displayResults(eoMatcher);
            clearInterval(intervalId);
        }
    }, 1000);
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
}

function main() {
    let sg = new ScrambleGenerator();
    let eoFinder = new EoFinder(5);
    let eoMatcher;
    let intervalId;
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", async function() {
        resetUI();
        try{
            clearInterval(intervalId);
        } catch {}
        attemptInProgress = true;
        startBtn.disabled = true;
        let scram = sg.getPaddedScramble();
        const foundEos = await eoFinder.findAllSub5EosRecursive(scram);
        console.log(foundEos);
        eoMatcher = new EoMatcher(foundEos);
        document.getElementById("scramble-string").innerHTML = scram;
        document.getElementById("normal-scramble-view").setAttribute("alg", scram);
        document.getElementById("inverse-scramble-view").setAttribute("alg", Cube.inverse(scram));
        startBtn.disabled = false;
        var timer = parseInt(document.getElementById("time-limit-m").value) * 60 + parseInt(document.getElementById("time-limit-s").value);
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
        } catch {}
    });

    const eoInputField = document.getElementById("entered-eo");
    eoInputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if(!attemptInProgress) return;
            const error = document.getElementById("error-msg");
            const foundEosDiv = document.getElementById("list-eos-found");
            error.innerHTML = "";
            let eo = document.getElementById("inverse").checked ? invert(eoInputField.value) : eoInputField.value;
            eo = eo.toUpperCase();
            if(eoMatcher.checkIfFoundEo(eo)) {
                error.innerHTML = "EO already found";
            } else if (!eoMatcher.checkIfEo(eo)){
                error.innerHTML = "Invalid EO";
            } else {
                foundEosDiv.appendChild(getEoDiv(EoFormatter.formatEo(eo)));
                error.innerHTML = "";
                if(document.getElementById("clear-eo").checked) eoInputField.value = "";
            }
        }
    });

    
    const showInverseCheck = document.getElementById("toggle-inverse-image");
    showInverseCheck.addEventListener('click', function(event) {
        if(showInverseCheck.checked) {
            document.getElementById("normal-scramble-title").style.visibility = "visible";
            document.getElementById("inverse-scramble").style.display = "";
        } else {
            document.getElementById("normal-scramble-title").style.visibility = "hidden";
            document.getElementById("inverse-scramble").style.display = "none";
        }
    });

    const scrambleViewSelector = document.getElementById("scramble-view-mode");
    scrambleViewSelector.addEventListener('change', function(event) {
        if(event.target.value == "2d") {
            document.getElementById("normal-scramble-view").setAttribute("visualization", "2D");
            document.getElementById("inverse-scramble-view").setAttribute("visualization", "2D");
        } else {
            document.getElementById("normal-scramble-view").setAttribute("visualization", "3D");
            document.getElementById("inverse-scramble-view").setAttribute("visualization", "3D");
        }
    });

    const maxMoveCount = document.getElementById("moves-slider");
    maxMoveCount.addEventListener('change', () => {
        document.getElementById("moves-slider-value").innerHTML = maxMoveCount.value;
        displayEos(eoMatcher.getMissedEos());
    });
    const showInverse = document.getElementById("inverse-filter");
    showInverse.addEventListener('change', () => displayEos(eoMatcher.getMissedEos()));
    const showNiss = document.getElementById("niss-filter");
    showNiss.addEventListener('change', () => displayEos(eoMatcher.getMissedEos()));
    const showFB = document.getElementById("axis-filter-fb");
    showFB.addEventListener('change', () => displayEos(eoMatcher.getMissedEos()));
    const showRL = document.getElementById("axis-filter-rl");
    showRL.addEventListener('change', () => displayEos(eoMatcher.getMissedEos()));
    const showUD = document.getElementById("axis-filter-ud");
    showUD.addEventListener('change', () => displayEos(eoMatcher.getMissedEos()));
}
    
main();
