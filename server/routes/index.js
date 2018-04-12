/**
 * This is the index file for all routes
 * -> import all route files here and export index
 */
const express = require('express');
const Crawler = require('../models/Crawler');
const router = express.Router();

router.get('/', (req, res) => res.send('Awais Qureshi and Pierre Seguin COMP 4601 Project'))

router.get('/loc/*', (req, res) => { 
    res.send(req.params[0]);
});

router.get('/update', (req, res) => {
    let cr = new Crawler(() => res.json({success:true})).addToQueue('https://www.toronto.ca/ext/open_data/catalog/delivery/open_data_catalog.json');
});

module.exports = router