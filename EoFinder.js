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

export class EoFinder {

    async findAllSub5EosRecursive(scramble) {
        await init();
        let cube = new ArrayCube();
        cube.do_alg(scramble);
        let normalEOs = [];
        for(const move of allMoves) {
            this.recuriveCheck("", move, cube, normalEOs);
        }
        cube = new ArrayCube();
        cube.do_alg(Cube.inverse(scramble));
        let inverseEOs = [];
        for(const move of allMoves) {
            this.recuriveCheck("", move, cube, inverseEOs);
        }
        inverseEOs = inverseEOs.map(eo => "(" + eo + ")");
        return normalEOs.concat(inverseEOs).sort((eo1, eo2) => eo1.split(" ").length - eo2.split(" ").length);
    }

    recuriveCheck(currentCheck, move, cube, foundEos) {
        currentCheck = currentCheck === "" ? move : currentCheck + " " + move;
        const moveCount = currentCheck.split(" ").length;

        if (moveCount > 5) {
            return;
        }
        cube.do_alg(move);

        if ("RL".includes(move) && cube.bad_edge_count(Axis.RL) == 0) {
            foundEos.push(currentCheck);
        }
        else if ("UD".includes(move) && cube.is_eo(Axis.UD)) {
            foundEos.push(currentCheck);
        }
        else if ("FB".includes(move) && cube.is_eo(Axis.FB)) {
            foundEos.push(currentCheck);
        }

        if (moveCount === 4) {
            for (const finalMove of eoEndingFollowup[move]) {
                this.recuriveCheck(currentCheck, finalMove, cube, foundEos);
            }
        } else {
            for (const nextMove of followUp[move[0]]) {
                this.recuriveCheck(currentCheck, nextMove, cube, foundEos);
            }
        }

        cube.do_alg(inverse[move]);
    }
}