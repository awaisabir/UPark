const Crawler = require('../models/Crawler');

const c = new Crawler(() => console.log('done')).addToQueue("https://www.toronto.ca/ext/open_data/catalog/delivery/open_data_catalog.json");