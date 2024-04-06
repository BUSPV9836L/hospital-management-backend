const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

db.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); 
  });

module.exports = db;
