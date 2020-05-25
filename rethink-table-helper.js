/**
 * @class Creates a new instanse of table helper
 * @description In the constructor, a table reference and
 * database reference should be passed
 */
class RethinkTableHelper {
  /**
   * @constructor
   * @param {Object} tableReference
   * @param {Object} dbConnection
   */
  constructor(tableReference, dbConnection) {
    // Set database connection
    this.db = dbConnection;
    // Set table reference
    this.setTable(tableReference);
  }

  /**
   * @description Set table reference
   * @param {Object} tableReference
   */
  setTable(tableReference) {
    this.tableReference = tableReference;
  }

  /**
   * @description Create new doc(s)
   * @param {*} docs Can be a single object or array of objects
   * @param {*} callBack (Optional) Will be called after
   * successful database creation
   */
  add(docs, callBack = () => {}) {
    return new Promise((resolve, reject) => {
      let preparedData = null;
      // Check if provided docs is an array
      // and prepare the data to add
      if (Array.isArray(docs)) {
        // Array
        preparedData = [...docs];
      } else {
        // Object
        preparedData = { ...docs };
      }
      // Add the data
      this.tableReference.insert(docs).run(this.db, (err, result) => {
        // Throw error if occured
        if (err) reject(err);
        // On successful insert
        // Send back the response
        callBack(result);
        resolve(result);
      });
    });
  }

  /**
   * @description Get docs from current table
   * @param {Object} filterOptions Filter values in key value pair
   * @param {*} callBack (Optional) Will be called after
   * successful database creation
   */
  get(filterOptions = {}, callBack = () => {}) {
    return new Promise(async (resolve, reject) => {
      // Run the query
      this.tableReference
        .filter(filterOptions)
        .run(this.db, async (err, result) => {
          // Throw error if occured
          if (err) reject(err);
          // On successful query
          // Get the docs
          const docs = await result.toArray();
          // Send back the docs
          callBack(docs);
          resolve(docs);
        });
    });
  }

  /**
   * @description Update docs
   * @param {Object} filterOptions Filter values in key value pair
   * @param {Object} updateTo Values to update in key value pair
   * @param {*} callBack (Optional) Will be called after
   * successful database creation
   */
  update(filterOptions = {}, updateTo, callBack = () => {}) {
    return new Promise(async (resolve, reject) => {
      // Run the query
      this.tableReference
        .filter(filterOptions)
        .update(updateTo)
        .run(this.db, (err, result) => {
          // Throw error if occured
          if (err) reject(err);
          // Send back the response
          callBack(result);
          resolve(result);
        });
    });
  }

  /**
   * @description Delete docs
   * @param {Object} filterOptions Filter values in key value pair
   * @param {*} callBack (Optional) Will be called after
   * successful database creation
   */
  delete(filterOptions = {}, callBack = () => {}) {
    return new Promise(async (resolve, reject) => {
      // Run the query
      this.tableReference
        .filter(filterOptions)
        .delete()
        .run(this.db, (err, result) => {
          // Throw error if occured
          if (err) reject(err);
          // Send back the response
          callBack(result);
          resolve(result);
        });
    });
  }
}

module.exports = RethinkTableHelper;
