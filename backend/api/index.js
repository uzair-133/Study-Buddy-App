const app = require("../src/app");
const ConnectToDb = require("../src/db/db");

ConnectToDb();

module.exports = app;
