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
    const showNormal = document.getElementById("normal-filter").checked;
    const showInverse = document.getElementById("inverse-filter").checked;
    const showNiss = document.getElementById("niss-filter").checked;
    const showFB = document.getElementById("axis-filter-fb").checked;
    const showRL = document.getElementById("axis-filter-rl").checked;
    const showUD = document.getElementById("axis-filter-ud").checked;
    missedEOs.filter((eo) => {
        if(EoFormatter.getEoLength(eo) > maxEoLength) return false;
        if(!showNormal && EoFormatter.isNormalEo(eo)) return false;
        if(!showInverse && EoFormatter.isInverseEo(eo)) return false;
        if(!showNiss && EoFormatter.isNissEo(eo)) return false;
        if(!showFB && EoFormatter.isEoFB(eo)) return false;
        if(!showRL && EoFormatter.isEoRL(eo)) return false;
        if(!showUD && EoFormatter.isEoUD(eo)) return false;
        return true;
    }).forEach(eo => missedEosSpan.appendChild(getEoDiv(eo)));
}

function displayResults(eoMatcher) {
    stopTime = Date.now();
    const report = document.getElementById('report');
    report.style.visibility = 'visible';
    const foundEos = eoMatcher.getFoundEos();
    const missedEos = eoMatcher.getMissedEos();
    displayEos(missedEos);
    const foundEosNumSpan = document.getElementById("eos-found-num");
    foundEosNumSpan.innerHTML = foundEos.length;
    const timeTakenSpan = document.getElementById("time-taken");
    timeTakenSpan.innerHTML = formatTime(Math.round((stopTime - startTime) / 1000))
    const missedEosNumSpan = document.getElementById("missed-eos-num");
    missedEosNumSpan.innerHTML = missedEos.length;
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
    const plusOneBtn = document.getElementById("plus-one-btn");
    plusOneBtn.addEventListener('click', function(event) {
        if(!attemptInProgress) return;
        timer += 60;
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
}

async function main() {
    let sg = new ScrambleGenerator();
    let eoFinder = new EoFinder(5);
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
        const foundEos = await eoFinder.findAllSub5EosRecursive(scram);
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

    const customScrambleCheck = document.getElementById("use-custom-scramble");
    customScrambleCheck.addEventListener('click', function(event) {
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
    customScrambleEntry.addEventListener('input', function(event) {
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
    maxMoveCount.addEventListener('change', () => {
        document.getElementById("moves-slider-value").innerHTML = maxMoveCount.value;
        displayEos(eoMatcher.getMissedEos());
    });
    const showNormal = document.getElementById("normal-filter");
    showNormal.addEventListener('change', () => displayEos(eoMatcher.getMissedEos()));
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
