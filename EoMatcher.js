export class EoMatcher {
    constructor(allEos) {
        this.allEos = allEos;
        this.foundEos = [];
        this.missedEOs = [...allEos];
    } 

    getNormalPortion(eoString) {
        try {
            return eoString.replace(/^\([^)]*\)\s*/, '');
        } catch {
            return "";
        }
    }

    getInversePortion(eoString) {
        try {
            return eoString.match(/\(([^)]*)\)/)[1];
        } catch {
            return "";
        }
    }

    formatEoString(eoString) {
        const swapMoves = function(i, moves) {
            let temp = moves[i];
            moves[i] = moves[i-1];
            moves[i-1] = temp;
        }

        let moves = eoString.match(/([RLFBUD]'?2?)/g);
        if(!moves) return "";
        
        for(let i = 1; i < moves.length; i++) {
            if(moves[i][0] == 'F' && moves[i-1][0] == 'B') {
                swapMoves(i, moves);
            }
            else if(moves[i][0] == 'R' && moves[i-1][0] == 'L') {
                swapMoves(i, moves);
            }
            else if(moves[i][0] == 'U' && moves[i-1][0] == 'D') {
                swapMoves(i, moves);
            }
        }
        return moves.join(" ");
    }

    formatEo(eoString) {
        let normal = this.getNormalPortion(eoString);
        let inverse = this.getInversePortion(eoString);
        normal = this.formatEoString(normal)
        inverse = this.formatEoString(inverse);
        if(inverse != "") {
            
            return normal + "(" + inverse + ")";
        }
        return this.formatEoString(normal);
    }

    checkIfEo(eo) {
        eo = this.formatEo(eo).trim();
        console.log(eo);
        if(this.allEos.includes(eo)) {
            this.foundEos.push(eo);
            this.missedEOs.splice(this.allEos.indexOf(eo), 1);
            return true;
        }  
        return false;
    }

    checkIfFoundEo(eo) {
        eo = this.formatEo(eo);
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