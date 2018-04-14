const express = require('express');
const Crawler = require('../models/Crawler');
const CSVParser = require('../models/CSVParser');
const UserBasedCF = require('../algo/UserBasedCF');
const CoordinateManager = require('../models/CoordinateManager');
const Sector = require('../models/Sector');
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

router.get('/price/*/*', async (req, res) => {

    let numberOfQuadrants = 10;
    try{
      let testCoords = await Dbi.getCoordinates();
      let coordMan = new CoordinateManager();
      let userLat = parseFloat(req.params[0]);
      let userLong = parseFloat(req.params[1]);
      
      //get the best sectors based on dataset
      let s = new Sector(coordMan);
      let matrices = await s.getBestMatrix(userLat,userLong,numberOfQuadrants);

      //determine which quadrant lat and long
      let userLatIndex = coordMan.getLatIndex(req.params[0]);
      let userLongIndex = coordMan.getLongIndex(req.params[1]);
      if (userLatIndex === -1 || userLongIndex === -1){
        return res.json({success:false, message:'coordinate was out of range'});
      }

      //find predictions around the users sector
      let priceCF = new UserBasedCF(matrices.priceMatrix); 
      let ticketCF = new UserBasedCF(matrices.ticketMatrix); 
      //determines area around the user's Sector
      let regions = [{x:-1,y:1}, {x:0,y:1}, {x:1,y:1}, {x:-1,y:0}, {x:0, y:0}, {x:1,y:0}, {x:-1,y:-1}, {x:0,y:-1}, {x:1,y:-1}];
      let topRegions = [];
      //finds the average cost of each quadrant
      for(let i = 0; i<regions.length; i++)
        topRegions[i] = {
          lat:coordMan.lats[i], 
          long:coordMan.longs[i], 
          price: priceCF._computeUserBasedPrediction(userLatIndex + regions[i].x,userLongIndex + regions[i].y),
          tickets: ticketCF._computeUserBasedPrediction(userLatIndex + regions[i].x,userLongIndex + regions[i].y),
        };
      //finds the top 3 locations based on price and ticket number
      let minVals = [0,0,0];
      for(let i = 0; i < topRegions.length; i++)
          for(let j = minVals.length-1; j >= 0 ; j--)
            if(topRegions[minVals[j]].price/topRegions[minVals[j]].tickets > topRegions[i].price/topRegions[i].tickets) {
              for(let k = minVals.length - 1; k > j; k--)
                  minVals[k] = minVals[k-1];
              minVals[j] = i;
              break;
            }
      return res.json({success:true, value:[topRegions[minVals[0]], topRegions[minVals[1]], topRegions[minVals[1]]]});
      
    } catch(err){
      console.log(err);
    }

});

module.exports = router;