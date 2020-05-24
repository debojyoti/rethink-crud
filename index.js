const dbDriver = require("rethinkdb");
const rethinkTableHelper = require("./rethink-table-helper");

const deafultDbConfig = {
  host: "localhost",
  port: 28015,
};

class RethinkDB {
  static startEngine(connectionConfig = deafultDbConfig) {
    return new Promise((resolve, reject) => {
      dbDriver.connect(connectionConfig, function (err, conn) {
        if (err) throw err;
        RethinkDB.connection = conn;
        resolve();
      });
    });
  }

  constructor(dbName) {
    this.setDb(dbName);
  }

  setDb(dbName) {
    this.db = dbDriver.db(dbName);
  }

  collection(tableName) {
    this.tableConnection = this.db.table(tableName);
    const tableHelper = new rethinkTableHelper(
      this.tableConnection,
      RethinkDB.connection
    );
    return tableHelper;
  }

  static createDb(dbName, callback = () => {}) {
    return new Promise((resolve, reject) => {
      try {
        dbDriver.dbCreate(dbName).run(RethinkDB.connection, () => {
          callback();
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  createCollection(collectionName, callback = () => {}) {
    return new Promise((resolve, reject) => {
      try {
        this.db.tableCreate(collectionName).run(RethinkDB.connection, () => {
          callback();
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  listCollections(callback = () => {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.db.tableList().run(RethinkDB.connection);
        resolve(list);
        callback(list);
      } catch (error) {
        reject(error);
      }
    });
  }

  static close() {
    RethinkDB.connection.close();
  }
}

module.exports = RethinkDB;
