const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "13.125.98.110",
  user: "root",
  password: "chayasa100!",
  database: "WebRtc",
});

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    rows = await conn.query("SELECT * FROM topic");
    console.log(rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) return conn.end();
  }
}

asyncFunction();
