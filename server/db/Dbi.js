const DB_CONFIG = require('../config/db');
const sqlite = require('sqlite3').verbose();

// MongoDB Singleton
class DBInterface {
  constructor() {
    if(!DBInterface.instance) {
      this._db = new sqlite.Database(`${__dirname}/prod.db`, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {
        if (err) throw err.message;

        console.log('DB Connection established');
      })

      DBInterface.instance = this;
    }
  }

  initDB() {
    // call this function to set up the initial tables
  }

  closeConnection() {
    this._db.close(err => {
      if (err) throw err;

      console.log(`DB Connection closed successfully`);
    });
  }

  dropDB() {
    // call this function to drop the whole database
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
}

const instance = new DBInterface();

module.exports = instance;