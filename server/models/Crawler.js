const fs             = require("fs");
const unzip          = require("unzip");
const BaseCrawler    = require('crawler');
const MongoInterface = require('../db/Dbi');

class Crawler {
  constructor() {
    this.c   = new BaseCrawler({
      maxConnections : 10,
      encoding:null,
      // This will be called for each crawled page
      callback : (error, res, done) => {
        if(error) {
            console.log(error);
        } else {
          let $ = res.$;
          if (res.headers['content-type'] === 'application/zip') {
            // parse the csv
            var filepath = "./data/"+(new RegExp(".*/(.*\.zip)").exec(res.options.uri)[1]);
            fs.createWriteStream(filepath).write(res.body, 
              function(err){
                if(err){
                  console.log(err);
                } else {
                  fs.createReadStream(filepath).pipe(unzip.Extract({ path: './data'}));
                  fs.unlink(filepath);
                }});
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

console.log(new RegExp(".*/(.*\.zip)").exec("/s/af/fasdklfjskad.zip")[1]);
var c = new Crawler();
c.addToQueue("https://www.toronto.ca/ext/open_data/catalog/delivery/open_data_catalog.json");

// module.exports = Crawler