const express = require('express');
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

router.get('/price/*/*', async (req, res) => {
    //determine which lat and long the request belongs to
    let numberOfQuadrants = 3;
    try{
      let testCoords = await Dbi.getCoordinates();
      let coordMan = new CoordinateManager();
      coordMan.setQuadrantsCoordinates(testCoords, numberOfQuadrants);
      let userLat = coordMan.getLatIndex(req.params[0]);
      let userLong = coordMan.getLongIndex(req.params[1]);
      
      if (userLat === -1 || userLong === -1){
        return res.json({success:false, message:'coordinate was out of range'});
      }
  
      let matrix = [];
      for (let i = 0; i < coordMan.lats.length-1; i++) {
        matrix[i] = [];
        for (let j = 0; j < coordMan.longs.length-1; j++)
          matrix[i][j] = -1;
      }
      for (let i = 0; i < coordMan.lats.length-1; i++)
        for (let j = 0; j < coordMan.longs.length-1; j++){
          let tickets = await Dbi.getTicketNumberForQuadrant(coordMan.lats[i],coordMan.lats[i+1], coordMan.longs[j], coordMan.longs[j+1]);
          if(tickets != 0)
            matrix[i][j] += tickets;
        }
    
  
  
  
      // for(let coordinate of testCoords) {
      //     let weight = 1;//request the database for the number of tickets issued at the location / the cost of tickets at the location
      //     console.log(coordinate + ", " + coordMan.getLatIndex(coordinate.Lat) + " : " + coordMan.getLongIndex(coordinate.Long));
      //     matrix[coordMan.getLatIndex(coordinate.Lat)][coordMan.getLongIndex(coordinate.Long)] += await Dbi.getTicketNumberForQuadrant();
      // }
      // console.log(matrix);
  
      let uCF = new UserBasedCF(matrix); 
      let weight = uCF._computeUserBasedPrediction(userLat,userLong);
      return res.json({success:true, value:weight});
    }
    catch(err){
      console.log(err);
    }

});

module.exports = router;