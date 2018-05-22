const fs = require("fs");

let config = {
  "Config": {
    "dbConnectionString": "mongodb://localhost:27017",
    "mainDbName": "holidayServiceMainDB",
    "schedulingDbName": "holidayServiceAgendaDB",
    "hostingPort": 3001,
    "holidayConfig": JSON.parse(fs.readFileSync('./config/holidayConfig.json'))
  }
};

module.exports = config;