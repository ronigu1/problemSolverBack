var sqlite3 = require('sqlite3').verbose();

// let db;
// The OPEN_READWRITE flag is used to open the database for both reading and writing.

function createDb() {
  return new sqlite3.Database('C:/sqlite/roojoomDB.db',
  sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
          console.error("Error connecting to the database:", err.message);
        } else {
          console.log('Connected to the database.');
        }
    });
}

function closeDb(db) {
    db.close((err) => {
        if(err){
            console.error(err.message);
        }
        console.log('data connection closed')
    });
}



module.exports = {
    createDb: createDb,
    closeDb: closeDb
}