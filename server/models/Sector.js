
const CoordinateManager = require('../models/CoordinateManager');
const Dbi = require('../db/Dbi');

class Sector {
    constructor(coordinateManger) {
        this.cm = coordinateManger;
        this.pricematrix = [];
        this.ticketMatrix = [];
    }

    //initializes matrix to the new defined sizes of the coordinate manager
    setMatrix(){
        this.pricematrix = [];
        this.ticketMatrix = [];
        for (let i = 0; i < this.cm.lats.length-1; i++) {
            this.pricematrix[i]  = [];
            this.ticketMatrix[i] = [];
            for (let j = 0; j < this.cm.longs.length-1; j++) {
                this.pricematrix[i][j] = -1;
                this.ticketMatrix[i][j] = -1;
            }
        }
    }
    
    getBestMatrix(lat, long, numberOfQuadrants) {
        return new Promise(async (resolve,reject) => {
            try {
                //sets initial constants
                let goodMatrix = false;
                let factor = 0.05;
                let minLat = lat - 0.05, maxLat = lat + 0.05;
                let minLong = long -0.05, maxLong = long + 0.05;
                let iterations = 1;
                let bounds = 0.7;
                while (!goodMatrix){
                    //initialize quadrants
                    this.cm.setQuadrantsCoordinatesFromBoundaries(minLat, maxLat, minLong, maxLong, numberOfQuadrants);
                    //reset the matrix
                    this.setMatrix();
                    //initialize the matrix
                    for (let i = 0; i < this.cm.lats.length-1; i++)
                        for (let j = 0; j < this.cm.longs.length-1; j++){
                            let tickets = await Dbi.getTicketNumberForQuadrant(this.cm.lats[i],this.cm.lats[i+1], this.cm.longs[j], this.cm.longs[j+1]);
                            let price = await Dbi.getPriceAVGForQuadrant(this.cm.lats[i],this.cm.lats[i+1], this.cm.longs[j], this.cm.longs[j+1]);
                            if(tickets != null && tickets) {
                                this.pricematrix[i][j] = price;
                                this.ticketMatrix[i][j] = tickets;
                            }
                        }
                        
                        //determine how many unknonwns there are in the matrix
                        let count = 0;
                        for (let i = 0; i < this.cm.lats.length-1; i++)
                            for (let j = 0; j < this.cm.longs.length-1; j++)
                                if(this.pricematrix[i][j] != -1)
                                    count ++;
                        console.log(count + " " + bounds*(this.cm.lats.length*this.cm.longs.length) + " " + bounds);
                        // if the unknowns are manageable
                        if(count + 20 > bounds*(this.cm.lats.length*this.cm.longs.length)){
                            goodMatrix = true;
                        } else {
                            //recomputer the constants
                            factor = (factor + 0.001) %0.1;
                            minLat = lat - factor, maxLat = lat + factor;
                            minLong = long - factor, maxLong = long + factor;
                            if(iterations++%20 == 0){
                                bounds -= 0.05;
                                minLat  = lat - 0.05, maxLat = lat + 0.05;
                                minLong = long -0.05, maxLong = long + 0.05;
                            }
                        }
                }
                resolve({priceMatrix: this.pricematrix, ticketMatrix: this.ticketMatrix});
            } catch(err) {
                reject(err);
            }
        });

    }
}

module.exports = Sector