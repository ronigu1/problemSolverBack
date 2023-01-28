let db = require('./db');
// let dbInstance
dbInstance = db.openDB();

async function insertRow(table,data) {
    let keys = Object.keys(data);
    let values = Object.values(data);
    let placeholders = keys.map(() => '?').join(', ');
    let sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`

    return new Promise((resolve, reject) => {
        dbInstance.run(sql, values, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
//event exit(ctrl+c in terminal)
process.on('exit', function() {
    db.closeDb(dbInstance);
});
  
exports.insertRow = insertRow;
