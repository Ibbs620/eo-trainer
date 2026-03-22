export class EoFormatter {

    static oppositeFace = {
        "F" : "B",
        "B" : "F",
        "U" : "D",
        "D" : "U",
        "L" : "R",
        "R" : "L"
    };
    
    static allowAutoCancel = false;

    static setAutoCancel(value) {
        this.allowAutoCancel = value;
    }

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
        return validRegex.test(eoString.trim()
            .replace("′" , "'")
            .replace("’", "'")
            .toUpperCase());
    }

    static formatEoString(eoString) {
        let moves = eoString
            .replace("′" , "'")
            .replace("’", "'")
            .toUpperCase()
            .match(/([RLFBUD]'?2?)/g);
        if(!moves) return "";
        if(this.allowAutoCancel) this.cancelMoves(moves);
        return moves.join(" ");
    }

    static cancelMoves(moves) {
        let windowSize = 1;
        let prevAxis = ''
        let currentAxis = '';
        let i = 0;
        while(i <= moves.length) {
            prevAxis = currentAxis;
            if(i == moves.length) {
                currentAxis = "";
            } else if(moves[i][0] == 'F' || moves[i][0] == 'B') {
                currentAxis = "F";
            }
            else if(moves[i][0] == 'R' || moves[i][0] == 'L') {
                currentAxis = "R";
            }
            else if(moves[i][0] == 'U' || moves[i][0] == 'D') {
                currentAxis = "U";
            }
            if(prevAxis === currentAxis) {
                windowSize++;
            } else if (windowSize != 1) {
                let movesToSimplify = moves.slice(i - windowSize, i);
                let faceA = prevAxis;
                let faceB = this.oppositeFace[faceA];
                let aCount = 0;
                let bCount = 0;
                for(const move of movesToSimplify) {
                    if(move[0] === faceA) {
                        if(move.length === 1) aCount += 1
                        else if (move[1] === "'") aCount -=1
                        else aCount += 2
                    } else if(move[0] === faceB) {
                        if(move.length === 1) bCount += 1
                        else if (move[1] === "'") bCount -=1
                        else bCount += 2
                    }
                }
                let simplifiedMoves = []
                aCount %= 4;
                bCount %= 4;
                if(aCount !== 0) {
                    simplifiedMoves.push(faceA + (aCount === 2 ? "2" : aCount === 3 ? "'" : ""));
                }
                if(bCount !== 0) {
                    simplifiedMoves.push(faceB + (bCount === 2 ? "2" : bCount === 3 ? "'" : ""));
                }
                moves.splice(i - windowSize, windowSize, ...simplifiedMoves);
                i -= windowSize - simplifiedMoves.length;
                windowSize = 1;
            }
            i++;
        } 
        return moves;
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