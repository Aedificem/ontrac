var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
  console.log("Forum");
});

module.exports = function(io) {
  return {router: router, models: []}
};
