module.exports = function(app) {
  var express = require('express');
  var threadsRouter = express.Router();
  threadsRouter.get('/', function(req, res) {
    res.send({"threads":[
      {
        id: 1,
        name: 'Thread',
        color: '#be202e',
        stream: 2,
        connections: [1]
      }
    ]});
  });
  app.use('/api/threads/*', threadsRouter);
};
