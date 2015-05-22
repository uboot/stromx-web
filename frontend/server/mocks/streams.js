module.exports = function(app) {
  var express = require('express');
  var streamsRouter = express.Router();
  streamsRouter.get('/', function(req, res) {
    res.send({"streams":[
      {
        id: 2,
        name: 'Stream one',
        file: 1,
        active: false,
        paused: false,
        operators: [0, 1, 2, 4],
        connections: [1, 2],
        views: [1, 2]
      },
      {
        id: 3,
        name: 'Stream two',
        file: 2,
        active: false,
        paused: false,
        operators: [3],
        connections: [],
        views: []
      },
      {
        id: 4,
        name: 'Stream three',
        file: 3,
        active: false,
        paused: false,
        operators: [],
        connections: [],
        views: []
      }
    ]});
  });
  streamsRouter.put('/', function(req, res) {
    res.send('null');
  });
  app.use('/api/streams/*', streamsRouter);
};
