var mariadb = require("mariadb");
var db = mariadb.createPool({
  host: "13.125.98.110",
  user: "root",
  password: "chayasa100!",
  database: "WebRtc",
});
module.exports = db;
