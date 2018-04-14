class Quadrant {
    constructor() {
        this.matrix = [];
    }

    setMatrix(lats, long){
        while(! optimalMatrix) {
            matrix = [];
            for (let i = 0; i < coordMan.lats.length-1; i++) {
                matrix[i] = [];
                for (let j = 0; j < coordMan.longs.length-1; j++)
                    matrix[i][j] = -1;
            }
        }
    
    
    
    
        for(let coordinate of testCoords) {
            let weight = 1;//request the database for the number of tickets issued at the location / the cost of tickets at the location
            matrix[coordMan.getLatIndex(coordinate.lat)][coordMan.getLongIndex(coordinate.long)] += weight;
        }
    }
}