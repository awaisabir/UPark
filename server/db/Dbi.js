const DB_CONFIG = require('../config/db');
const MongoClient = require('mongodb').MongoClient;

// MongoDB Singleton
class MongoInterface {
  constructor() {
    if(!MongoInterface.instance){
      MongoClient.connect(DB_CONFIG.db, (err, client) => {
        this._db = client.db('COMP4601');
        this._collection = this._db.collection('files');
      });

      MongoInterface.instance = this;
    }
  }

  _doesFileExist(url) {
    const query = {url};

    return new Promise((resolve, reject) => {
      this._collection.findOne(query).then(file => {
        if (file) resolve(true);
        else resolve(false);
      }).catch(err => reject(new Error('Something went wrong with the call')));
    });
  }

  insertFile(url, callback) {
    this._doesFileExist(url).then(result => {
      if (result) {
        callback('File exists', null);
      } else {
        this._collection.insert({url}).then(file => {
          callback(null, true);
        }).catch(err => callback(err, null));
      }
    });
  }
}

const instance = new MongoInterface();
// Object.freeze(instance);

module.exports = instance;