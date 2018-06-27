const express = require('express');
const project = require('../models/project');
const router = express.Router();

router.get('/', function (req, res) {
  project.getProject(req.query.id, function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

module.exports = router;