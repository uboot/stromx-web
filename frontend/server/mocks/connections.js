module.exports = function(app) {
  var express = require('express');
  var connectionsRouter = express.Router();
  connectionsRouter.get('/', function(req, res) {
    res.send({"connections":[
      {
        id: 1,
        output: 5,
        input: 2,
        thread: 1,
        stream: 2
      },
      {
        id: 2,
        output: 5,
        input: 3,
        thread: null,
        stream: 2
      }
    ]});
  });
  connectionsRouter.delete('/', function(req, res) {
    res.send('null');
  });
  connectionsRouter.put('/', function(req, res) {
    res.send('null');
  });
  connectionsRouter.post('/', function(req, res) {
    res.send({
      'connection': {
        id: 3, 
        output: "5", 
        input: "1", 
        thread: "1", 
        stream: "2" // FIXME: sending the stream causes deleted connections to reappear...
      }
    });
  });
  app.use('/api/connections', connectionsRouter);
  app.use('/api/connections/*', connectionsRouter);
};
