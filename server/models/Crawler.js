const fs             = require("fs");
const unzip          = require("unzip");
const BaseCrawler    = require('crawler');
const MongoInterface = require('../db/Dbi');

class Crawler {
  constructor() {
    this.c   = new BaseCrawler({
      maxConnections : 10,
      encoding : null,
      callback : async (error, res, done) => {
        if(error) {
            console.log(error);
        } else {
          let { $, body, options } = res;
          
          if (res.headers['content-type'] === 'application/zip') {
            let filepath = "./data/"+(new RegExp(".*/(.*\.zip)").exec(options.uri)[1]);
            fs.createWriteStream(filepath).write(body, err => {
                if(err){
                  console.log(err);
                } else {
                  fs.createReadStream(filepath).pipe(unzip.Extract({ path: './data'}));
                  fs.unlink(filepath);
                }
              });
          } else if (res.headers['content-type'] === 'application/json') {
            let info = JSON.parse(res.body);
            let parkingTickets = info.filter(i => i.title === 'Parking Tickets');
            
            for (let datalink of parkingTickets[0].datalinks) {
              const { link } = datalink;

              try {
                let fileStatus = await MongoInterface.insertFile(link);
                console.log('File(s) Inserted');
              } catch(err) { console.log(err); }
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

let c = new Crawler();
c.addToQueue("https://www.toronto.ca/ext/open_data/catalog/delivery/open_data_catalog.json");

// module.exports = Crawler