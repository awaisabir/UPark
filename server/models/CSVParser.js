const fs = require('fs');
const readline = require('readline');
const DBInterface = require('../db/Dbi');

/**
 * @class CSVParser
 * @param : Location for csv file to parse
 * @example : new CSVParser('/path/to/csv').parse(results => console.log(results));
 */
class CSVParser {
  constructor(csvloc) {
      this.csvloc = csvloc;  
  }

  /**
   * @function : parse
   * @param callback : callback to run after the parsing of the file is done
   * @returns object containing all the addresses in the csv file
   */
  parse(callback) {
    let addr = {};
    let rd = readline.createInterface({
        input:  fs.createReadStream(this.csvloc),
        output: false,
        console: false
    });

    let index = 0;
    rd.on('line', function(line) {
        if (index === 0 ){
            index++;
        } else {
        let addrString = line.split(',')[7];
        let addrNum = (new RegExp("(\\d*)").exec(addrString)[1]);
        let rangedAddress = addrNum - addrNum % 20
        rangedAddress += 5;
        let addrName = (new RegExp("[\\s\\d]*(.*)[\\s\\d]*").exec(addrString)[1]);

        if (!addr[addrName]){
            addr[addrName] = {}
            addr[addrName][`${rangedAddress}`] = [line.split(',')[4]];
        }
        else if(!addr[addrName][addrNum])
            addr[addrName][`${rangedAddress}`] = [line.split(',')[4]];
        else  
            addr[addrName][rangedAddress] = [...addr[addrName][rangedAddress], line.split(',')[4]];
      }
    });

    // run callback once done reading file
    rd.on('close', () => {
        callback(addr);
    });
  }
}

module.exports = CSVParser;