module.exports = function(app) {
  var express = require('express');
  var inputsRouter = express.Router();
  inputsRouter.get('/', function(req, res) {
    res.send({"inputs":[]});
  });
  app.use('/api/inputs', inputsRouter);
};
