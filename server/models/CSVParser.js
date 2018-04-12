const fs = require('fs');
const readline = require('readline');
const DBInterface = require('../db/Dbi');
//new CSVParser('./data/Parking_Tags_data_2015_1.csv'); //howto
class CSVParser {
    constructor(csvloc) {
        this.csvloc = csvloc;  
        this._parse((addr)=>{
            let num = 0;
            for(let k of Object.keys(addr)){
                num += Object.keys(addr[k]).length;
                console.log(k);
            }
            console.log(num);
            console.log('done');
        });
    }

    _parse(callback) {
        let addr = {};
        let rd = readline.createInterface({
            input:  fs.createReadStream(this.csvloc),
            output: process.stdout,
            console: false
        });
    
            let index = 0;
            rd.on('line', function(line) {
                if (index === 0 ){
                    index ++;
                } else {
                let addrString = line.split(',')[7];
                let addrNum = (new RegExp("(\\d*)").exec(addrString)[1]);
                let rangedAddress = addrNum - addrNum % 10
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
            rd.on('close', () => {
                callback(addr);
          });
    }
}

module.exports = CSVParser;