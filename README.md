# NodeJS helper methods wrapper for **RethinkDB** v2.4.0


![](https://d7umqicpi7263.cloudfront.net/img/product/7c566e29-e8b9-46cd-addc-d620104c3b07/ded422c3-10de-4e26-8b98-e7d92949d6c1.png)


### Prerequisites

1. Install rethink db 

    https://rethinkdb.com/docs/install/

2. Require node and npm/yarn
3. Start rethinkdb by running
```sh
rethinkdb
```

## Steps to create a database and a collection to get started

```javascript
// Connect the wrapper engine with rethinkdb
await rethinkDb.startEngine({
  host: "localhost",
  port: 28015,
});

// Create a db to start
await rethinkDb.createDb("my-db");

// Db created!
// So get the db reference to use it further
const myDbRef = new rethinkDb("my-db");

// Create a collection (table) on the db
await myDbRef.createCollection("notes");

// Show all collections
const collections = await myDbRef.listCollections();
console.log("collections :>> ", collections);
```

## Easy CRUD opertations

```javascript

// Connect the wrapper engine with rethinkdb
await rethinkDb.startEngine({
  host: "localhost",
  port: 28015,
});

// Initiate the wrapper 
// and pass the database name currently you want to work with 
// So it will be selected by default for futire operations
// It will return the database reference
const db = new rethinkDb("my-db");

// Now get the collection reference you want to work with
const notes = db.collection("users");

// Add a document
await notes.add({myNoteText: "Rethinkdb is a realtime no sql database!", author: "Debojyoti"});

// Get all documents
const allNotes = await notes.getDocs();

// Get a specific doc
const debojyotiNotes = await notes.getDocs({author: "Debojyoti"});

// Update a specific doc
await notes.updateDocs(
  {author: "Debojyoti"},                          //  Here goes the filters
  {email: "debojyoti.js@gmail.com"}                // And now what to update
);

// Delete a specific doc
await notes.updateDocs(
  {author: "Debojyoti"}                          //  Here goes the filters
);

```