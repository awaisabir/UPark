const DB_CONFIG = require('../config/db');
const MongoClient = require('mongodb').MongoClient;

// MongoDB Singleton
class MongoInterface {
  constructor() {
    if(!MongoInterface.instance) {
      MongoClient.connect(DB_CONFIG.db, (err, client) => {
        this._db = client.db('COMP4601');
        this._collection = this._db.collection('files');
      });

      MongoInterface.instance = this;
    }
  }
  
  _doesFileExist(url) { 
    return this._collection.findOne({url});
  }

  insertFile(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this._doesFileExist(url);
        if (result) reject('File exists');
        else {
          let file = await this._collection.insert({url});
          resolve(file)
        }
      } catch (err) { reject(err); }
    });
  }
}

const instance = new MongoInterface();

module.exports = instance;