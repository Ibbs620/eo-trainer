import { EoFormatter } from "./EoFormatter.js";
import init, { ArrayCube, Axis} from "./pkg/cubelab.js";

const allMoves = [
    "R", "R'", "R2", 
    "L", "L'", "L2", 
    "F", "F'", "F2", 
    "B", "B'", "B2", 
    "U", "U'", "U2", 
    "D", "D'", "D2"];

const followUp = {
    'R' : allMoves.slice(3),
    'L' : allMoves.slice(6),
    'F' : allMoves.slice(0,6).concat(allMoves.slice(9)),
    'B' : allMoves.slice(0,6).concat(allMoves.slice(12)),
    'U' : allMoves.slice(0,12).concat(allMoves.slice(15)),
    'D' : allMoves.slice(0,12)
}

const axis = {
    'R' : Axis.RL,
    'L' : Axis.RL,
    'F' : Axis.FB,
    'B' : Axis.FB,
    'U' : Axis.UD,
    'D' : Axis.UD
}

const inverse = {
    "R"  : "R'", 
    "R'" : "R", 
    "R2" : "R2", 
    "L"  : "L'",  
    "L'" : "L", 
    "L2" : "L2", 
    "F"  : "F'", 
    "F'" : "F", 
    "F2" : "F2", 
    "B"  : "B'", 
    "B'" : "B", 
    "B2" : "B2", 
    "U"  : "U'", 
    "U'" : "U", 
    "U2" : "U2", 
    "D"  : "D'", 
    "D'" : "D", 
    "D2" : "D2"
}

const eoEndingFollowup = {
    "R"  : ["L", "F", "B", "U", "D"],
    "R'" : ["F", "B", "U", "D"],
    "R2" : ["F", "B", "U", "D"], 
    "L"  : ["F", "B", "U", "D"],  
    "L'" : ["F", "B", "U", "D"],
    "L2" : ["F", "B", "U", "D"], 
    "F"  : ["L", "R", "B", "U", "D"], 
    "F'" : ["L", "R", "U", "D"],
    "F2" : ["L", "R", "U", "D"], 
    "B"  : ["L", "R", "U", "D"], 
    "B'" : ["L", "R", "U", "D"],
    "B2" : ["L", "R", "U", "D"], 
    "U"  : ["L", "F", "B", "R", "D"], 
    "U'" : ["L", "F", "B", "R"],
    "U2" : ["L", "F", "B", "R"], 
    "D"  : ["L", "F", "B", "R"], 
    "D'" : ["L", "F", "B", "R"],
    "D2" : ["L", "F", "B", "R"]
}

const nissStartOneMove = [
    "F","B","R","L","U","D"
];

const nissStartTwoMove = Array.from(Object.entries(eoEndingFollowup))
                            .flatMap(([key, arr]) => arr.map(el => `${key} ${el}`));

export class EoFinder {

    async findAllSub5EosRecursive(scramble) {
        await init();
        let cube = new ArrayCube();
        const inverseScramble = Cube.inverse(scramble);

        console.log("Finding normal EOs");
        //Normal EOs
        cube.do_alg(scramble);
        let normalEOs = [];
        for(const move of allMoves) {
            this.recuriveCheck("", move, cube, normalEOs);
        }
        console.log(normalEOs);

        console.log("Finding inverse EOs");
        //Inverse EOs
        cube = new ArrayCube();
        cube.do_alg(inverseScramble);
        let inverseEOs = [];
        for(const move of allMoves) {
            this.recuriveCheck("", move, cube, inverseEOs);
        }
        inverseEOs = inverseEOs.map(eo => "(" + eo + ")");
        console.log(inverseEOs);

        console.log("Finding 1+ on normal EOs");
        //1 normal + X inverse EOs  
        let oneMoveOnNormalEos = [];
        for(const move of allMoves) {
            for(const premoves of nissStartOneMove) {
                cube = new ArrayCube();
                cube.do_alg(Cube.inverse(premoves));
                cube.do_alg(inverseScramble);
                let inversePortion = [];
                this.recuriveCheck("", move, cube, inversePortion, 4, [axis[premoves.at(-1)]]);
                for(const sequence of inversePortion) {
                    if(sequence.split(" ").length > 1) oneMoveOnNormalEos.push(premoves + " ("+ sequence + ")" );
                }
            }
        }
        console.log(oneMoveOnNormalEos);
        

        console.log("Finding 1+ on inverse EOs");
        //1 inverse + X normal EOs
        let oneMoveOnInverseEos = [];
        for(const move of allMoves) {
            for(const premoves of nissStartOneMove) {
                cube = new ArrayCube();
                cube.do_alg(Cube.inverse(premoves));
                cube.do_alg(scramble);
                let normalPortion = [];
                this.recuriveCheck("", move, cube, normalPortion, 4, [axis[premoves.at(-1)]]);
                for(const sequence of normalPortion) {
                    if(sequence.split(" ").length > 1) oneMoveOnInverseEos.push("("+ premoves + ") " + sequence);
                }
            }
        }
        console.log(oneMoveOnInverseEos);

        console.log("Finding 2+ on normal EOs");
        //2 normal + X inverse EOs
        let twoMoveOnNormalEos = [];
        for(const move of allMoves) {
            for(const premoves of nissStartTwoMove) {
                cube = new ArrayCube();
                cube.do_alg(Cube.inverse(premoves));
                cube.do_alg(inverseScramble);
                let inversePortion = [];
                this.recuriveCheck("", move, cube, inversePortion, 3, [axis[premoves.at(-1)]]);
                for(const sequence of inversePortion) {
                    if(sequence.split(" ").length > 2) twoMoveOnNormalEos.push(premoves + " ("+ sequence + ")" );
                }
            }
        }
        console.log(twoMoveOnNormalEos);
        
        console.log("Finding 2+ on inverse EOs");
        //2 inverse + X normal EOs
        let twoMoveOnInverseEos = [];
        for(const move of allMoves) {
            for(const premoves of nissStartTwoMove) {
                cube = new ArrayCube();
                cube.do_alg(Cube.inverse(premoves));
                cube.do_alg(scramble);
                let normalPortion = [];
                this.recuriveCheck("", move, cube, normalPortion, 3, [axis[premoves.at(-1)]]);
                for(const sequence of normalPortion) {
                    if(sequence.split(" ").length > 2) twoMoveOnInverseEos.push("("+ premoves + ") " + sequence);
                }
            }
        }
        console.log(twoMoveOnInverseEos);

        let allEos = this.removeDuplicates([...normalEOs, ...inverseEOs, ...oneMoveOnNormalEos, ...twoMoveOnNormalEos, ...oneMoveOnInverseEos, ...twoMoveOnInverseEos]);
        return allEos.sort((eo1, eo2) => this.getEoLength(eo1) - this.getEoLength(eo2));
    }

    removeDuplicates(foundEos) {
        const eosDuplicatesRemoved = [];
        for(const eo of foundEos) {
            let normal = EoFormatter.getNormalPortion(eo);
            let inverse = EoFormatter.getInversePortion(eo);
            if(normal.endsWith("U' D") || normal.endsWith("F' B") || normal.endsWith("R' L")) {
                continue
            }
            if(inverse.endsWith("U' D") || inverse.endsWith("F' B") || inverse.endsWith("R' L")) {
                continue
            }
            if(normal.endsWith("U2 D") || normal.endsWith("F2 B") || normal.endsWith("R2 L")) {
                continue
            }
            if(inverse.endsWith("U2 D") || inverse.endsWith("F2 B") || inverse.endsWith("R2 L")) {
                continue
            }
            eosDuplicatesRemoved.push(eo);
        }
        return eosDuplicatesRemoved
    }

    getEoLength(eoString) {
        let normal = EoFormatter.getNormalPortion(eoString);
        let inverse = EoFormatter.getInversePortion(eoString);
        return normal.split(" ").length + inverse.split(" ").length;
    }

    recuriveCheck(currentCheck, move, cube, foundEos, maxN = 5, checkAxis = [Axis.FB, Axis.RL, Axis.UD]) {
        currentCheck = currentCheck === "" ? move : currentCheck + " " + move;
        const moveCount = currentCheck.split(" ").length;

        if (moveCount > maxN) {
            return;
        }
        cube.do_alg(move);

        if (checkAxis.includes(Axis.RL) && "RL".includes(move) && cube.bad_edge_count(Axis.RL) == 0) {
            foundEos.push(currentCheck);
        }
        else if (checkAxis.includes(Axis.UD) && "UD".includes(move) && cube.is_eo(Axis.UD)) {
            foundEos.push(currentCheck);
        }
        else if (checkAxis.includes(Axis.FB) && "FB".includes(move) && cube.is_eo(Axis.FB)) {
            foundEos.push(currentCheck);
        }

        if (moveCount === maxN - 1) {
            for (const finalMove of eoEndingFollowup[move]) {
                this.recuriveCheck(currentCheck, finalMove, cube, foundEos, maxN, checkAxis);
            }
        } else {
            for (const nextMove of followUp[move[0]]) {
                this.recuriveCheck(currentCheck, nextMove, cube, foundEos, maxN, checkAxis);
            }
        }

        cube.do_alg(inverse[move]);
    }
}