module.exports = function(app) {
  var express = require('express');
  var outputsRouter = express.Router();
  outputsRouter.get('/', function(req, res) {
    res.send({"outputs":[
      {
        id: 4,
        title: 'Output image',
        operator: 2,
        connections: []
      },
      {
        id: 5,
        title: 'Generated number',
        operator: 0,
        connections: [1, 2]
      },
      {
        id: 6,
        title: 'Received image',
        operator: 3,
        connections: []
      }
    ]});
  });
  app.use('/api/outputs/*', outputsRouter);
};
