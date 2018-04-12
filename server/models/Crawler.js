const fs             = require("fs");
const unzip          = require("unzip");
const BaseCrawler    = require('crawler');
const DBInterface    = require('../db/Dbi');

class Crawler {
  constructor(cb) {
    this.c   = new BaseCrawler({
      maxConnections : 10,
      encoding : null,
      callback : async (error, res, done) => {
        if(error) {
            console.log(error);
        } else {
          let { $, body, options } = res;
          
          if (res.headers['content-type'] === 'application/zip') {
            console.log('adding to data folder');
            let filepath = `${__dirname}/../../data/${(new RegExp(".*/(.*\.zip)").exec(options.uri)[1])}`;
            fs.createWriteStream(filepath).write(body, err => {
                if(err){
                  console.log(err);
                } else {
                  fs.createReadStream(filepath).pipe(unzip.Extract({ path: `${__dirname}/../../data/`}));
                  fs.unlink(filepath);
                }
              });
          } else if (res.headers['content-type'] === 'application/json') {
            let info = JSON.parse(res.body);
            let parkingTickets = info.filter(i => i.title === 'Parking Tickets');
            
            for (let datalink of parkingTickets[0].datalinks) {
              const { link } = datalink;

              try {
                let fileStatus = await DBInterface.insertFile(link);
                this.addToQueue(link);
                console.log(link + ' File(s) Inserted');
              } catch(err) { console.log(err); }
            }
          }
        }

        console.log(this.c.queue.length);
        // if(this.c.queue.length < 1)
        //   cb();

        done();
      }
    });
  }

  addToQueue(url) {
    this.c.queue(url);
  }
}

 module.exports = Crawler