export class ScrambleGenerator {

    constructor() {
        Cube.initSolver();
    }

    getPaddedScramble() {
        var inverseUnpadded = "R F";
        while("RL".includes(inverseUnpadded[0])  || "FB".includes(inverseUnpadded[inverseUnpadded.length - 1]) || "FB".includes(inverseUnpadded[inverseUnpadded.length - 2])) {   
            var scramble = Cube.scramble();
            var scrambledCube = new Cube();
            scrambledCube.move("F' U R " + scramble + " F' U R");
            inverseUnpadded = scrambledCube.solve()
        }
        return "R' U' F " + Cube.inverse(inverseUnpadded) + " R' U' F";  
    };
}