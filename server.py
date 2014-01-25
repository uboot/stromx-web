# -*- coding: utf-8 -*-

import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket

import model

_streams = model.Streams()
_files = model.Files('files', _streams)
_errors = model.Errors()

class StreamsHandler(tornado.web.RequestHandler):
    def get(self, index = None):  
        if index == None:
            json = tornado.escape.json_encode(_streams.data)
        else:
            json = tornado.escape.json_encode(_streams[index].data)
        self.write(json) 
    
    def put(self, index):
        data = tornado.escape.json_decode(self.request.body)
        stream = _streams.set(index, data)
        json = tornado.escape.json_encode(stream)
        self.write(json)  
        _errors.add("test")
  
class FilesHandler(tornado.web.RequestHandler):
    def get(self, index = None):  
        if index == None:
            json = tornado.escape.json_encode(_files.data)
        else:
            json = tornado.escape.json_encode(_files[index].data)
        self.write(json)
    
    def delete(self, index):
        _files.delete(index)
        self.write("null")
        
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        f = _files.add(data)
        json = tornado.escape.json_encode(f)
        self.write(json)   
    
    def put(self, index):
        data = tornado.escape.json_decode(self.request.body)
        f = _files.set(index, data)
        json = tornado.escape.json_encode(f)
        self.write(json) 
        
class ErrorsHandler(tornado.web.RequestHandler):
    def get(self, index = None):  
        if index == None:
            json = tornado.escape.json_encode(_errors.data)
        else:
            json = tornado.escape.json_encode(_errors[index].data)
        self.write(json)   
    
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