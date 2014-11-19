module.exports = function(app) {
  var express = require('express');
  var errorsRouter = express.Router();
  errorsRouter.get('/', function(req, res) {
    res.send({"errors":[
      {
        id: 1,
        time: new Date('2014-01-20T12:47:07+00:00'),
        description: "Failed to open stream file"
      },
      {
        id: 2,
        time: new Date('2014-01-20T13:00:00+00:00'),
        description: "Failed to initialize blur operator"
      }
    ]});
  });
  app.use('/api/errors', errorsRouter);
};
