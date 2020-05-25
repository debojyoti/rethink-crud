# **RethinkDB** crud helper methods for NodeJS

![](https://d7umqicpi7263.cloudfront.net/img/product/7c566e29-e8b9-46cd-addc-d620104c3b07/ded422c3-10de-4e26-8b98-e7d92949d6c1.png)


### Prerequisites

1. Install rethink db 

    https://rethinkdb.com/docs/install/

2. Start rethinkdb by running
```sh
rethinkdb
```

## Steps to create a database and a collection to get started

```javascript
const rethinkDb = require("rethink-crud");


// Connect the wrapper engine with rethinkdb
await rethinkDb.startEngine({
  host: "localhost",
  port: 28015,
});

// Create a db to start
await rethinkDb.createDb("my-db");

// Db created!
// So get the db reference to use it further
const db = new rethinkDb("my-db");

// Create a collection (table) on the db
await db.createCollection("notes");

// Show all collections
const collections = await db.listCollections();
console.log("collections :>> ", collections);
```

## Easy CRUD operations

```javascript
const rethinkDb = require("rethink-crud");


// Connect the wrapper engine with rethinkdb
await rethinkDb.startEngine({
  host: "localhost",
  port: 28015,
});

// Initiate the wrapper 
// and pass the database name currently you want to work with 
// So it will be selected by default for future operations
// It will return the database reference
const db = new rethinkDb("my-db");

// Now get the collection reference you want to work with
const notes = db.collection("notes");

// Add a document
await notes.add({myNoteText: "Rethinkdb is a realtime no sql database!", author: "Debojyoti"});

// Get all documents
const allNotes = await notes.get();

// Get filtered doc(s)
const debojyotiNotes = await notes.get({author: "Debojyoti"});

// Update a specific doc
await notes.update(
  {author: "Debojyoti"},                           //  Here goes the filters
  {email: "debojyoti.js@gmail.com"}                // And now what to update
);

// Delete a specific doc
await notes.delete(
  {author: "Debojyoti"}                           //  Here goes the filters
);

```