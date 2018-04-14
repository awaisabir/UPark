class CoordinateManager {

    constructor() {
        this.lats = [];
        this.longs = [];
    }

    setQuadrantsCoordinates(newCoord, numberOfQuadrants) {
        this.lats = [];
        this.longs = [];
        let minLat      = this._getMin(newCoord, 'lat');
        let maxLat      = this._getMax(newCoord, 'lat');
        let minLong     = this._getMin(newCoord, 'long');
        let maxLong     = this._getMax(newCoord, 'long');
        console.log(minLat + " " + maxLat);
        console.log(minLong + " " + maxLong);
        
        let latFactor   = (maxLat - minLat)/(numberOfQuadrants - 1);
        let longFactor  = (maxLong - minLong)/(numberOfQuadrants - 1);
        this.initLats(minLat, latFactor, numberOfQuadrants);
        this.initLongs(minLong, longFactor, numberOfQuadrants);       
    }

    setQuadrantsCoordinates(minLat, maxLat, minLong, maxLong, numberOfQuadrants) {
        this.lats = [];
        this.longs = [];
        let latFactor   = (maxLat - minLat)/(numberOfQuadrants - 1);
        let longFactor  = (maxLong - minLong)/(numberOfQuadrants - 1);
        this.initLats(minLat, latFactor, numberOfQuadrants);
        this.initLongs(minLong, longFactor, numberOfQuadrants); 
    }

    initLats(minLat, latFactor, numberOfQuadrants) {
        for(let i = 0; i < numberOfQuadrants; i++) {
            this.lats[i]  = minLat  + latFactor  * (i);
        }
    }

    initLongs(minLong, longFactor, numberOfQuadrants) {
        for(let i = 0; i < numberOfQuadrants; i++) {
            this.longs[i]  = minLong  + longFactor  * (i);
        }
    }


    getLatIndex(userLat) {
        for(let i = 0; i<this.lats.length-1; i++)
            if (this.lats[i] <= userLat && this.lats[i+1] >= userLat)
                return i;
        return -1;
    }
    getLongIndex(userLong) {
        for(let i = 0; i<this.longs.length-1; i++)
            if (this.longs[i] <= userLong && this.longs[i+1] >= userLong)
                return i;
        return -1;
    }
    _getMin (numbers, key) {
        let min = Number.MAX_VALUE
        for(let j of numbers)
            if(min > j[key])
                min = j[key];
        return min;
    }
    
    _getMax(numbers, key){
        let max = -Number.MAX_VALUE;
        for(let j of numbers){
            if(max < j[key])
                max = j[key];
        }
        return max;
    }
    
}

module.exports = CoordinateManager