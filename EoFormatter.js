export class EoFormatter {
    static getNormalPortion(eoString) {
        try {
            return eoString.replace(/\([^)]*\)/, "").trim();;
        } catch {
            return "";
        }
    }

    static getInversePortion(eoString) {
        try {
            return eoString.match(/\(([^)]*)\)/)[1];
        } catch {
            return "";
        }
    }

    static checkValidString(eoString){
        const validRegex = /^(?:\s*[RLFBUD](?:'|2)?\s*|\s*\([RLFBUD](?:'|2)?(?:\s*[RLFBUD](?:'|2)?)*\)\s*)+$/;
        return validRegex.test(eoString.trim());
    }

    static formatEoString(eoString) {
        const swapMoves = function(i, moves) {
            let temp = moves[i];
            moves[i] = moves[i-1];
            moves[i-1] = temp;
        }

        let moves = eoString
            .replace("′" , "'")
            .replace("’", "'")
            .toUpperCase()
            .match(/([RLFBUD]'?2?)/g);
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

    static formatEo(eoString) {
        eoString = eoString.toUpperCase();
        let normal = this.getNormalPortion(eoString);
        let inverse = this.getInversePortion(eoString);
        normal = this.formatEoString(normal)
        inverse = this.formatEoString(inverse);
        if(this.countMoves(inverse) > 0) {
            if(this.countMoves(inverse) < this.countMoves(normal)) {
                return "(" + inverse + ") " + normal;
            }
            return normal + " (" + inverse + ")";
        }
        return normal;
    }

    static isEoFB(eoString) {
        return "FB".includes(this.formatEo(eoString).replace(/['2()]/g, "").at(-1));
    }

    static isEoRL(eoString) {
        return "RL".includes(this.formatEo(eoString).replace(/['2()]/g, "").at(-1));
    }

    static isEoUD(eoString) {
        return "UD".includes(this.formatEo(eoString).replace(/['2()]/g, "").at(-1));
    }

    static countMoves(str) {
        str = str.trim();
        return str === "" ? 0 : str.split(/\s+/).length;
    }

    static isInverseEo(eoString) {
        let normal = this.getNormalPortion(eoString);
        let inverse = this.getInversePortion(eoString);
        const normalLength = this.countMoves(normal);
        const inverseLength = this.countMoves(inverse);
        return normalLength == 0 && inverseLength > 0;
    }

    static isNormalEo(eoString) {
        let normal = this.getNormalPortion(eoString);
        let inverse = this.getInversePortion(eoString);
        const normalLength = this.countMoves(normal);
        const inverseLength = this.countMoves(inverse);
        return normalLength > 0 && inverseLength == 0;
    }

    static isNissEo(eoString) {
        let normal = this.getNormalPortion(eoString);
        let inverse = this.getInversePortion(eoString);
        normal = this.formatEoString(normal);
        inverse = this.formatEoString(inverse);
        const normalLength = this.countMoves(normal);
        const inverseLength = this.countMoves(inverse);
        return normalLength > 0 && inverseLength > 0;
    }

    static getEoLength(eoString) {
        let normal = this.getNormalPortion(eoString);
        let inverse = this.getInversePortion(eoString);
        const normalLength = this.countMoves(normal);
        const inverseLength = this.countMoves(inverse);
        return normalLength + inverseLength;
    }
}