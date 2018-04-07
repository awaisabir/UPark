const mongoose    = require('mongoose');
const BaseCrawler = require('crawler');
const MongoInterface = require('../db/Dbi');

// url -> https://www.toronto.ca/ext/open_data/catalog/delivery/open_data_catalog.json
class Crawler {
  constructor() {
    this.c   = new BaseCrawler({
      maxConnections : 10,
      callback : (error, res, done) => {
        if(error) {
            console.log(error);
        } else {
          let $ = res.$;

          if (res.headers['content-type'] === 'application/zip') {
            // parse the csv

          } else if (res.headers['content-type'] === 'application/json') {
            let info = JSON.parse(res.body);
            let parkingTickets = info.filter(i => i.title === 'Parking Tickets');
            
            for (let datalink of parkingTickets[0].datalinks) {
              const { link } = datalink;

              MongoInterface.insertFile(link, (err, result) => {
                if (err) console.log(err);
                else console.log('File(s) Inserted');
              });
            }
          }
        }

        done();
      }
    });
  }

  addToQueue(url) {
    this.c.queue(url);
  }
}

module.exports = Crawler