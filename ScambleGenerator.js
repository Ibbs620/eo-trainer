export class ScrambleGenerator {

    constructor() {
        Cube.initSolver();
    }

    getPaddedScramble() {
        var inverseUnpadded = "R F";
        while(inverseUnpadded[0] == "R" || inverseUnpadded[inverseUnpadded.length - 1] == "F" || inverseUnpadded[inverseUnpadded.length - 2] == "F") {   
            var scramble = Cube.scramble();
            var scrambledCube = new Cube();
            scrambledCube.move("F' U R " + scramble + " F' U R");
            inverseUnpadded = scrambledCube.solve()
        }
        return "R' U' F " + Cube.inverse(inverseUnpadded) + " R' U' F";  
    };
}