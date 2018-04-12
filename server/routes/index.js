/**
 * This is the index file for all routes
 * -> import all route files here and export index
 */
const express = require('express');
const Crawler = require('../models/Crawler');
const CSVParser = require('../models/CSVParser');
const UserBasedCF = require('../algo/UserBasedCF');
const router = express.Router();

router.get('/', (req, res) => res.send('Awais Qureshi and Pierre Seguin COMP 4601 Project'))

router.get('/loc/*', (req, res) => { 
    res.send(req.params[0]);
});

router.get('/update', (req, res) => {
    //crawl the dataset
    let cr = new Crawler(() => res.json({success:true})).addToQueue('https://www.toronto.ca/ext/open_data/catalog/delivery/open_data_catalog.json');
    //extract and clean addresses from csv
    let parser = new CSVParser('./data/Parking_Tags_data_2015_1.csv');
    parser._parse((addresses)=>{
    /*TODO*/
    //store addresses with ticket amount and average price to the database
    });

    /*TODO*/
    //find all lat longs of addresses in database and store them alonside in the db

});

router.get('/price/*/*', (req, res) => {
    //determine which lat and long the request belongs to
    let numberOfQuadrants = 4;
    let testLats  = [ -45.03879723, -45.07228457, -45.0932857, -45.1433982, -45.243987];
    let testLongs = [ 75.032837497,   75.023432657,   75.144156753,  75.524823729, 75.824823729];
    
    let lats        = [];
    let longs       = [];
    let minLat      = getMin(testLats);
    let maxLat      = getMax(testLats);
    let minLong     = getMin(testLongs);
    let maxLong     = getMax(testLongs);
    console.log(minLong);
    let latFactor   = (maxLat - minLat)/(numberOfQuadrants - 1);
    let longFactor  = (maxLong - minLong)/(numberOfQuadrants - 1);
    
    for(let i = 0; i < numberOfQuadrants; i++) {
        lats[i]  = minLat  + latFactor  * (i);
        longs[i] = minLong + longFactor * (i);
    }
    console.log(longs);
    let userLat = req.params[0];
    let userLong = req.params[1];
    let userLatIndex = -1;
    let userLongIndex = -1;
     for(let i = 0; i<lats.length-1; i++)
         if (lats[i] < userLat && lats[i+1] > userLat)
             userLatIndex = i+1;

     for(let i = 0; i<longs.length-1; i++)
         if (longs[i] < userLong && longs[i+1] > userLong)
             userLongIndex = i+1;
    console.log(userLatIndex+" "+userLongIndex);
    if (userLatIndex === -1 || userLongIndex === -1){
        res.send('The points defined are out of the scope that\'s analyzed');
        return;
    }


    let matrix = [  [200,  40,  -1, 50 ],
                    [ 30, 164,  80, 30 ],
                    [162,  -1,  -1, 32 ],
                    [ 44,  32,  83, 120] 
                ]; 
    let uCF = new UserBasedCF(matrix); 
    let weight = uCF._computeUserBasedPrediction(userLatIndex,userLongIndex);
    res.send(String(weight));
});
let getMin = (numbers) => {
    let min = Number.MAX_VALUE
    for(let j of numbers)
        if(min > j)
            min = j;
    return min;
}

let getMax = (numbers) => {
    let max = -Number.MAX_VALUE;
    for(let j of numbers){
        if(max < j)
            max = j;
    }
    return max;
}



module.exports = router;