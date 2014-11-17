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
        stream: 2
      },
      {
        id: 2,
        name: 'hough.stromx',
        content: '',
        opened: false,
        stream: 3
      }
    ]});
  });
  app.use('/api/files', filesRouter);
};
