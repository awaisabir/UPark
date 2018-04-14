const DB_CONFIG = require('../config/db');
const sqlite = require('sqlite3').verbose();
const Mapbox = require('../models/Mapbox');

// DB Singleton
class DBInterface {
  constructor() {
    if(!DBInterface.instance) {
      this._db = new sqlite.Database(`${__dirname}/prod.db`, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {
        if (err) throw err.message;

        this.requester = new Mapbox();
        console.log('DB Connection established');
      });

      DBInterface.instance = this;
    }
  }

  closeConnection() {
    this._db.close(err => {
      if (err) throw err;

      console.log(`DB Connection closed successfully`);
    });
  }
  
  // does my file exist
  _doesFileExist(url) {
    const SQL = `SELECT * FROM Files WHERE Url = ?`;

    return new Promise((resolve, reject) => {
      this._db.get(SQL, [url], (err, row) => {
        if (err) reject(err);

        if (!row) resolve(false);
        reject('File Exists');
      });
    });
  }

  // use does my file exist to insert file or not
  insertFile(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let existenceOfFile = await this._doesFileExist(url);
        if (!existenceOfFile) {
          const SQL = `INSERT INTO Files (Url) VALUES (?)`;

          this._db.run(SQL, [url], () => {
            resolve(true);
          });
        }
      } catch (err) { reject(err); }
    });
  }

  // save address as coords to the database
  saveLocation(address, price, tickets) {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT * FROM Addresses WHERE Address=(?)`;
      this._db.get(SQL, [address], async (err, row) => {
        if (err) reject(err);
        
        // if the address does not exist
        if (!row) {
          try {
            let coords = await this.requester.getForwardGeoLocation(address);
            const lat = coords['1'];
            const long = coords['0'];
            
            const SQL = `INSERT INTO Addresses VALUES ((?), (?), (?), (?), (?))`;
            this._db.run(SQL, [address, lat, long, price, tickets], err => {
              if (err) reject(err);

              resolve(true);
            });
          } catch (err) { reject({success : false, err : err}); }
        } else {
          reject({success : false, message: 'Address already exists'});
        }
      });
    });
  }

  getCoordinates() {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT * FROM Addresses`;
      
      this._db.all(SQL, [], (err, rows) => {
        if (err) reject(err);
        
        resolve(rows);
      });
    });
  }

  getCoordinatesWithinRange(minLat, maxLat, minLong, maxLong) {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT * FROM Addresses WHERE Lat < (?) AND Lat > (?) AND Long < (?) AND Long > (?)`;
      this._db.all(SQL, [maxLat, minLat, maxLong, minLong], async (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
  getTicketNumberForQuadrant(minLat, maxLat, minLong, maxLong) {
    return new Promise((resolve, reject) => {
      const SQL = `SELECT SUM(Price) FROM Addresses WHERE Lat < (?) AND Lat > (?) AND Long < (?) AND Long > (?)`;
      this._db.get(SQL, [maxLat, minLat, maxLong, minLong], async (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

    getPriceAVGForQuadrant(minLat, maxLat, minLong, maxLong) {
      return new Promise((resolve, reject) => {
        const SQL = `SELECT AVG(Price) FROM Addresses WHERE Lat < (?) AND Lat > (?) AND Long < (?) AND Long > (?)`;
        this._db.get(SQL, [maxLat, minLat, maxLong, minLong], async (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
  }
}

const instance = new DBInterface();

module.exports = instance;