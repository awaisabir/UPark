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

  async insertFile(url, callback) {
    try {
      let result = await this._doesFileExist(url);
      if (result) 
        callback('File exists', null);
      else {
        let file = await this._collection.insert({url});
        callback(null, file);
      }
    } catch (err) { callback(err, null); }
  }
}

const instance = new MongoInterface();

module.exports = instance;