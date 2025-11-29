import {EoFinder} from "./EoFinder.js";
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
    let eoMatcher = new EoMatcher([]);
    let normal = eoMatcher.getNormalPortion(eo);
    let inverse = eoMatcher.getInversePortion(eo);
    console.log(normal);
    console.log(inverse);
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

function displayResults(eoMatcher) {
    const report = document.getElementById('report');
    report.style.visibility = 'visible';
    const foundEos = eoMatcher.getFoundEos();
    const missedEos = eoMatcher.getMissedEos();
    const foundEosNumSpan = document.getElementById("eos-found-num");
    foundEosNumSpan.innerHTML = foundEos.length;
    const missedEosSpan = document.getElementById("missed-eos");
    missedEos.forEach((eo) => missedEosSpan.appendChild(getEoDiv(eo)));
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
            console.log(eo);
            if(eoMatcher.checkIfFoundEo(eo)) {
                error.innerHTML = "EO already found";
            } else if (!eoMatcher.checkIfEo(eo)){
                error.innerHTML = "Invalid EO";
            } else {
                foundEosDiv.appendChild(getEoDiv(eoMatcher.formatEo(eo)));
                error.innerHTML = "";
                if(document.getElementById("clear-eo").checked) eoInputField.value = "";
            }
        }
    });

    
    const showInverseCheck = document.getElementById("toggle-inverse-image");
    showInverseCheck.addEventListener('click', function(event) {
        if(showInverseCheck.checked) {
            document.getElementById("normal-scramble-title").style.visibility = "visible";
            document.getElementById("inverse-scramble").style.visibility = "visible";
        } else {
            document.getElementById("normal-scramble-title").style.visibility = "hidden";
            document.getElementById("inverse-scramble").style.visibility = "hidden";
        }
    });

    const scrambleViewSelector = document.getElementById("scramble-view");
    scrambleViewSelector.addEventListener('change', function(event) {
        if(event.target.value == "2d") {
            document.getElementById("normal-scramble-view").setAttribute("visualization", "2D");
            document.getElementById("inverse-scramble-view").setAttribute("visualization", "2D");
        } else {
            document.getElementById("normal-scramble-view").setAttribute("visualization", "3D");
            document.getElementById("inverse-scramble-view").setAttribute("visualization", "3D");
        }
    });
}
    
main();
