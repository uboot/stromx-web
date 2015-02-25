module.exports = function(app) {
  var express = require('express');
  var filesRouter = express.Router();
  filesRouter.get('/', function(req, res) {
    res.send({'files': [
      {
        id: 1,
        name: 'test.stromx',
        content: '',
        opened: true,
        saved: false,
        stream: 2
      },
      {
        id: 2,
        name: 'hough.stromx',
        content: '',
        opened: false,
        saved: false,
        stream: 3
      }
    ]});
  });
  filesRouter.delete('/', function(req, res) {
    res.send('null');
  });
  filesRouter.put('/', function(req, res) {
    res.send('null');
  });
  filesRouter.post('/', function(req, res) {
    res.send({
      'file': { 
        id: 3,
        stream: 4
      }
    });
  });
  app.use('/api/files', filesRouter);
  app.use('/api/files/*', filesRouter);
};
