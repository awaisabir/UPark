const BaseCrawler = require('crawler');

class Crawler {
  constructor() {
    this.c = new BaseCrawler({
      maxConnections : 10,
      // This will be called for each crawled page
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
              this.addToQueue(datalink.link);
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