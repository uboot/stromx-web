module.exports = function(app) {
  var express = require('express');
  var viewsRouter = express.Router();
  viewsRouter.get('/', function(req, res) {
    res.send({"views":[ {
        id: 1,
        name: 'Main view',
        observers: [
          {
            id: 0,
            type: 'inputObserver'
          },
          {
            id: 2,
            type: 'inputObserver'
          },
          {
            id: 0,
            type: 'parameterObserver'
          },
          {
            id: 3,
            type: 'inputObserver'
          }
        ],
        stream: 2
      }
    ]});
  });
  viewsRouter.post('/', function(req, res) {
    res.send('null');
  });
  app.use('/api/views', viewsRouter);
  app.use('/api/views/*', viewsRouter);
};
