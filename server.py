# -*- coding: utf-8 -*-

import httplib
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket

import model

_model = model.Model('files')
_streams = _model.streams
_files = _model.files
_errors = _model.errors

class ItemsHandler(tornado.web.RequestHandler):
    def get(self, index = None):
        try:
            if index == None:
                json = tornado.escape.json_encode(self.items.data)
            else:
                json = tornado.escape.json_encode(self.items[index].data)
            self.write(json) 
        except KeyError:
            self.set_status(httplib.NOT_FOUND)
    
    def put(self, index):
        try:
            data = tornado.escape.json_decode(self.request.body)
            item = self.items.set(index, data)
            json = tornado.escape.json_encode(item)
            self.write(json)  
        except KeyError:
            self.set_status(httplib.NOT_FOUND)
        
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        item = self.items.addData(data)
        json = tornado.escape.json_encode(item)
        self.write(json)  
    
    def delete(self, index):
        try:
            self.items.delete(index)
            self.write("null")
        except KeyError:
            self.set_status(httplib.NOT_FOUND)

class StreamsHandler(ItemsHandler):
    items = _streams
  
class FilesHandler(ItemsHandler):
    items = _files
    
class ErrorSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        _errors.errorHandlers.append(self.sendError)
    
    def on_close(self):
        _errors.errorHandlers.remove(self.sendError)
        
    def doSend(self, error):
        json = tornado.escape.json_encode(error.data)
        self.write_message(json)
        
    def sendError(self, error):
        loop = tornado.ioloop.IOLoop.instance()
        loop.add_callback(self.doSend, error)

def start():
    application = tornado.web.Application(
        [
            (r"/", tornado.web.RedirectHandler, {"url": "/static/index.html"}),
            (r"/files", FilesHandler),
            (r"/files/([0-9]+)", FilesHandler),
            (r"/streams", StreamsHandler),
            (r"/streams/([0-9]+)", StreamsHandler),
            (r"/error_socket", ErrorSocket),
            (r"/download/(.*)", tornado.web.StaticFileHandler,
             {"path": "files"}),
        ],
        static_path="static"
    )
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
    
if __name__ == "__main__":
    start()