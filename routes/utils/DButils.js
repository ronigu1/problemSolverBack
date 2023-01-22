let db = require('./db');
// let dfUtils
dfUtils = db.openDB();

async function insertRow(table,data) {
    let keys = Object.keys(data);
    let values = Object.values(data);
    let placeholders = keys.map(() => '?').join(', ');
    let sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`

    return new Promise((resolve, reject) => {
        dfUtils.run(sql, values, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
//event exit
process.on('exit', function() {
    db.closeDb(dfUtils);
});
  
exports.insertRow = insertRow;
