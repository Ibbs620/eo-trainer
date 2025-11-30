import { EoFormatter } from "./EoFormatter.js";

export class EoMatcher {
    constructor(allEos) {
        this.allEos = allEos;
        this.foundEos = [];
        this.missedEOs = [...allEos];
    } 

    checkIfEo(eo) {
        eo = EoFormatter.formatEo(eo).trim();
        console.log(eo);
        if(this.allEos.includes(eo)) {
            this.foundEos.push(eo);
            this.missedEOs.splice(this.allEos.indexOf(eo), 1);
            return true;
        }  
        return false;
    }

    checkIfFoundEo(eo) {
        eo = EoFormatter.formatEo(eo).trim();
        console.log(eo);
        return this.foundEos.includes(eo);
    }

    getFoundEos() {
        return this.foundEos;
    }

    getMissedEos() {
        return this.missedEOs;
    }

}