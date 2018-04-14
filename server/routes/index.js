const express = require('express');
const router = express.Router();

const Crawler = require('../models/Crawler');
const CSVParser = require('../models/CSVParser');
const UserBasedCF = require('../algo/UserBasedCF');
const CoordinateManager = require('../models/CoordinateManager');
const router = express.Router();
const Dbi = require('../db/Dbi');

router.get('/', (req, res) => res.send('Awais Qureshi and Pierre Seguin COMP 4601 Project'))

router.get('/update', (req, res) => {    
  let parser = new CSVParser(`${__dirname}/../../data/Parking_Tags_data_2015_1.csv`);

  parser.parse(async addr => {
    for (let address of Object.keys(addr)) {
      let totalPrice = 0;
      let avgPrice = 0;

      for (let keys of Object.keys(addr[address])) {
        let fullAddress = `${keys} ${address}`;

        let prices = addr[address][keys];
        for (let price of prices) {
          totalPrice += parseInt(price);
        }
        
        avgPrice = totalPrice / prices.length;

        try {
          let result = await Dbi.saveLocation(fullAddress, avgPrice, prices.length);
        } catch (err) { console.log(err); }
      }
    }
  });
});

router.get('/price/*/*', (req, res) => {
    //determine which lat and long the request belongs to
    let numberOfQuadrants = 3;
    let testCoords  = [ {lat:-45.03879723, long:75.032837497}, {lat:-45.07228457,long:75.023432657}, {lat:-45.0932857,long:75.144156753}, {lat:-45.1433982,long:75.524823729}, {lat:-45.243987,long:75.824823729}];

    let coordMan = new CoordinateManager();
    coordMan.setQuadrantsCoordinates(testCoords, numberOfQuadrants);
    let userLat = coordMan.getLatIndex(req.params[0]);
    let userLong = coordMan.getLongIndex(req.params[1]);
    
    if (userLat === -1 || userLong === -1){
        res.json({status:false, message:'coordinate was out of range'});
        return;
    }

    let matrix = [];

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
        console.log(coordinate + ", " + coordMan.getLatIndex(coordinate.lat) + " : " + coordMan.getLongIndex(coordinate.long));
        matrix[coordMan.getLatIndex(coordinate.lat)][coordMan.getLongIndex(coordinate.long)] += weight;
    }
    console.log(matrix);

    let uCF = new UserBasedCF(matrix); 
    let weight = uCF._computeUserBasedPrediction(userLat,userLong);
    res.json({status:true, value:weight});
});

module.exports = router;