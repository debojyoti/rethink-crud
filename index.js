const dbDriver = require("rethinkdb");
const rethinkTableHelper = require("./rethink-table-helper");

//  The default config for RethinkDB
const deafultDbConfig = {
  host: "localhost",
  port: 28015,
};


/**
 * A wrapper with easy crud helper methods 
 * @class Creates a new instanse of db helper
 * @description In the constructor, a database name can
 * be passed to select it by default or use setDb("db-name") 
 * to select/change db later  
 */
class RethinkDB {

  /**
   * @description A static method to initiate the database connection. 
   * It should be called before performing any other actions
   * The database config object should be passed
   * @param {*} connectionConfig (Optional) Provide db config in the 
   * following format {host: "your-host", port: numericDbPort}, if not
   * provided, default config will be used { host: "localhost", port: 28015 }
   * @static 
   * @async
   * @returns promise
   */
  static startEngine(connectionConfig = deafultDbConfig) {
    return new Promise((resolve, reject) => {
      dbDriver.connect(connectionConfig, function (err, conn) {
        if (err) throw err;
        RethinkDB.connection = conn;
        resolve();
      });
    });
  }

  /**
   * @constructor
   * @param {string} dbName (optional) Provide database name to select 
   * by default or use setDb("db-name") to select/change db later
   */
  constructor(dbName = null) {
    // Check if dbName is provided
    if (dbName && dbName.length) {
      // Provided
      // So set it 
      this.setDb(dbName);
    }
  }

  /**
   * @description Set/Update database
   * @param {string} dbName Name of database 
   */
  setDb(dbName) {
    // Store the db reference for further uses
    this.db = dbDriver.db(dbName);
  }

  /**
   * @description Set/Update collection
   * @param {string} tableName Name of collection
   * @returns collection reference
   */
  collection(tableName) {
    // Check if a valid db reference is available 
    if (!this.db) {
      // Db reference not available
      throw "Please select a database first by using setDb()";
    } else {
      // Valid db reference available
      // Store the collection reference for further uses
      this.tableConnection = this.db.table(tableName);
      // Initialize the tableHelper with the db and collection reference
      const tableHelper = new rethinkTableHelper(
        this.tableConnection,
        RethinkDB.connection
      );
      // Return the tableHelper reference to call crud functions
      return tableHelper;
    }
  }

  /**
   * @description Create a database
   * @param {string} dbName Database name
   * @param {function} callback (Optional) Will be called after 
   * successful database creation
   * @returns Promise
   */
  static createDb(dbName, callback = () => {}) {
    return new Promise((resolve, reject) => {
      try {
        // Create the db
        dbDriver.dbCreate(dbName).run(RethinkDB.connection, () => {
          callback();
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description Create a new collection
   * @param {string} collectionName Provide new collection name
   * @param {function} callback (Optional) Will be called after 
   * successful database creation
   * @returns Promise
   */
  createCollection(collectionName, callback = () => {}) {
    return new Promise((resolve, reject) => {
      try {
        // Create the table
        this.db.tableCreate(collectionName).run(RethinkDB.connection, () => {
          callback();
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description Get all the collections list in the
   * selected database
   * @param {function} callback (Optional) Will be called after 
   * successful database creation
   * @returns Promise 
   */
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

  /**
   * @description Close the database connection (Not recommended)
   */
  static close() {
    RethinkDB.connection.close();
  }
}

module.exports = RethinkDB;
