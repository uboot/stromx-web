# -*- coding: utf-8 -*-

import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket

import model

_files = model.Files('files')

class StreamsHandler(tornado.web.RequestHandler):
    pass
  
class FilesHandler(tornado.web.RequestHandler):
    def get(self, index = None):  
        if index == None:
            json = tornado.escape.json_encode(_files.data)
        self.write(json)
    
    def delete(self, index):
        _files.delete(index)
        self.write("null")
        
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        f = _files.post(data)
        json = tornado.escape.json_encode(f)
        self.write(json)   

if __name__ == "__main__":
    application = tornado.web.Application(
        [
            (r"/", tornado.web.RedirectHandler, {"url": "/static/index.html"}),
            (r"/files", FilesHandler),
            (r"/files/([0-9]+)", FilesHandler),
            (r"/streams/([0-9]+)", StreamsHandler)
        ],
        static_path="static"
    )
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()