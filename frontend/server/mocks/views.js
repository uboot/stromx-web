module.exports = function(app) {
  var express = require('express');
  var viewsRouter = express.Router();
  viewsRouter.get('/', function(req, res) {
    res.send({"views": [ {
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
            type: 'outputObserver'
          },
          {
            id: 4,
            type: 'outputObserver'
          }
        ],
        stream: 2
      }, {
        id: 2,
        name: 'Second view',
        observers: [],
        stream: 2
      }
    ]});
  });
  viewsRouter.put('/', function(req, res) {
    res.send('null');
  });
  viewsRouter.post('/', function(req, res) {
    res.send({
      'view': { id: 3 }
    });
  });
  app.use('/api/views', viewsRouter);
  app.use('/api/views/*', viewsRouter);
};
