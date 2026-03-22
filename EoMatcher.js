import { EoFormatter } from "./EoFormatter.js";

export class EoMatcher {
    constructor(allEos) {
        this.allEos = allEos;
        this.foundEos = new Set();
        this.missedEOs = new Set(allEos);
        this.wrongEos = new Set();
    } 

    checkIfEo(eo) {
        eo = EoFormatter.formatEo(eo).trim();
        if(eo[eo.length - 1] === "'") eo = eo.substring(0, eo.length - 1);
        if(this.allEos.includes(eo))  {
            this.missedEOs.delete(eo);
            this.foundEos.add(eo);
            return true;
        }  
        return false;
    }

    removeEo(eo) {
        eo = EoFormatter.formatEo(eo).trim();
        this.foundEos.delete(eo);
        this.wrongEos.delete(eo)
    }

    checkIfFoundEo(eo) {
        eo = EoFormatter.formatEo(eo).trim();
        return this.foundEos.has(eo);
    }

    getFoundEos() {
        return [...this.foundEos];
    }

    getMissedEos() {
        return [...this.missedEOs];
    }
    
    addWrongEo(eo) {
        this.wrongEos.add(eo);
    }
    
    getWrongEos() {
        return [...this.wrongEos];
    }

    addExtraEo(eo) {
        eo = EoFormatter.formatEo(eo).trim();
        this.foundEos.add(eo);
    }
}