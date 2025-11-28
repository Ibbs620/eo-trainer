import {EoFinder} from "./EoFinder.js";
import {EoMatcher} from "./EoMatcher.js";
import {ScrambleGenerator} from "./ScambleGenerator.js";

function displayResults(eoMatcher) {
    const report = document.getElementById('report');
    report.style.visibility = 'visible';
    const foundEos = eoMatcher.getFoundEos();
    const missedEos = eoMatcher.getMissedEos();
    const foundEosNumSpan = document.getElementById("eos-found-num");
    foundEosNumSpan.innerHTML = foundEos.length;
    const missedEosSpan = document.getElementById("missed-eos");
    missedEosSpan.innerHTML = missedEos.join("<br>");
};

function startTimer(duration, display, eoMatcher) {
    var timer = duration, minutes, seconds;
    var intervalId = setInterval(function () {
        if(timer > 0) {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;
            timer--;
        } else {
            displayResults(eoMatcher);
            clearInterval(intervalId);
        }
    }, 1000);
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
    display.innerHTML = "10:00";
}

function main() {
    let sg = new ScrambleGenerator();
    let eoFinder = new EoFinder();
    let eoMatcher;
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", async function() {
        resetUI();
        startBtn.disabled = true;
        console.log("A");
        let scram = sg.getPaddedScramble();
        console.log(scram)
        document.getElementById("scramble-string").innerHTML = scram;
        document.getElementsByTagName("twisty-player")[0].setAttribute("alg", scram);
        const foundEos = await eoFinder.findAllSub5EosRecursive(scram);
        console.log(foundEos);
        eoMatcher = new EoMatcher(foundEos);
        startBtn.disabled = false;
        var tenMinutes = 10 * 60;
        const display = document.getElementById("time-left");
        startTimer(tenMinutes, display, eoMatcher);        
    });

    const eoInputField = document.getElementById("entered-eo");
    eoInputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const error = document.getElementById("error-msg");
            const foundEosP = document.getElementById("list-eos-found");
            error.innerHTML = "";
            let eo = eoInputField.value;
            console.log(eo);
            if(eoMatcher.checkIfFoundEo(eo)) {
                error.innerHTML = "EO already found";
            } else if (!eoMatcher.checkIfEo(eo)){
                error.innerHTML = "Invalid EO";
            } else {
                foundEosP.innerHTML = eo + "<br>" + foundEosP.innerHTML;
                error.innerHTML = "";
                eoInputField.value = "";
            }
        }
    });
}
    
main();
