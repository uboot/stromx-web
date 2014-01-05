# -*- coding: utf-8 -*-

import os

import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket

class File(object):
    def __init__(self, index, name):
        self.__index = str(index)
        self.__name = name
        
    @property
    def data(self):
        return {"id": self.__index, "name": self.__name}

_files = [File(index, name) for index, name in enumerate(os.listdir('files'))]

class StreamsHandler(tornado.web.RequestHandler):
    pass
  
class FilesHandler(tornado.web.RequestHandler):
    def get(self, index = None):  
        if index == None:
            dataList = {"files": [f.data for f in _files]}
            json = tornado.escape.json_encode(dataList)
        self.write(json)

if __name__ == "__main__":
    application = tornado.web.Application(
        [
            (r"/", tornado.web.RedirectHandler, {"url": "/static/index.html"}),
            (r"/files", FilesHandler),
            (r"/streams/([0-9]+)", StreamsHandler)
        ],
        static_path="static"
    )
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()