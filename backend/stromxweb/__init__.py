# -*- coding: utf-8 -*-

import httplib
import os
import re
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket

import model

class ItemsHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', 'http://192.168.1.101:4200')
    
    def options(self, *args, **kwargs):
        self.set_header('Access-Control-Allow-Headers', 
                        ('Content-Type, Depth, User-Agent, X-File-Size, '
                         'X-Requested-With, X-Requested-By, If-Modified-Since, '
                         'X-File-Name, Cache-Control'))
        self.set_header('Access-Control-Allow-Methods', 
                        'GET,PUT,POST,DELETE,OPTIONS')
        self.set_status(204)
        self.finish()
    
    def initialize(self, items):
        self.items = items
        
    def get(self, index = None):
        try:
            if index == None:
                query = tornado.escape.url_unescape(self.request.query)
                data = self.items.data
                if query != "":
                    ids = [str(index) for index in
                           re.findall('ids\[\]=(\d+)', query)]
                    resourceName = data.keys()[0]
                    items = data.values()[0]
                    filteredItems = [item for item in items
                                     if item['id'] in ids]
                    data = {resourceName: filteredItems}
                json = tornado.escape.json_encode(data)
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
        try:
            data = tornado.escape.json_decode(self.request.body)
            item = self.items.addData(data)
            json = tornado.escape.json_encode(item)
            self.write(json) 
        except model.AddDataFailed:
            self.set_status(httplib.NOT_FOUND)
    
    def delete(self, index):
        try:
            self.items.delete(index)
            self.write("null")
        except KeyError:
            self.set_status(httplib.NOT_FOUND)
            
class SocketHandler(tornado.websocket.WebSocketHandler):
    def initialize(self, items):
        self.__items = items
        
    def doSend(self, json):
        self.write_message(json)
        
    def sendValue(self, value):
        loop = tornado.ioloop.IOLoop.instance()
        json = tornado.escape.json_encode(value.data)
        loop.add_callback(lambda: self.doSend(json))
        
    def open(self):
        self.__items.handlers.append(self.sendValue)
    
    def on_close(self):
        self.__items.handlers.remove(self.sendValue)

class MainHandler(tornado.web.RequestHandler):
    def get(self, _):
        self.render("index.html")
        
def start(filesDir):
    appModel = model.Model(filesDir)
    serverDir = os.path.dirname(os.path.abspath(__file__))
    staticDir = os.path.join(serverDir, "static")
    assetDir = os.path.join(staticDir, "assets")
    handlers = [
        (r"/assets/(.*)", tornado.web.StaticFileHandler, {"path": assetDir}),
        (r"/api/operatorTemplates", ItemsHandler, 
         dict(items = appModel.operatorTemplates)),
        (r"/api/files", ItemsHandler, dict(items = appModel.files)),
        (r"/api/files/([0-9]+)", ItemsHandler, dict(items = appModel.files)),
        (r"/api/streams", ItemsHandler, dict(items = appModel.streams)),
        (r"/api/streams/([0-9]+)", ItemsHandler, dict(items = appModel.streams)),
        (r"/api/operators", ItemsHandler, dict(items = appModel.operators)),
        (r"/api/operators/([0-9]+)", ItemsHandler,
         dict(items = appModel.operators)),
        (r"/api/parameters", ItemsHandler, dict(items = appModel.parameters)),
        (r"/api/parameters/([0-9]+)", ItemsHandler,
         dict(items = appModel.parameters)),
        (r"/api/enumDescriptions", ItemsHandler, 
         dict(items = appModel.enumDescriptions)),
        (r"/api/enumDescriptions/([0-9]+)", ItemsHandler,
         dict(items = appModel.enumDescriptions)),
        (r"/api/connections", ItemsHandler, 
         dict(items = appModel.connections)),
        (r"/api/connections/([0-9]+)", ItemsHandler,
         dict(items = appModel.connections)),
        (r"/api/inputs", ItemsHandler, 
         dict(items = appModel.inputs)),
        (r"/api/inputs/([0-9]+)", ItemsHandler,
         dict(items = appModel.inputs)),
        (r"/api/outputs", ItemsHandler, 
         dict(items = appModel.outputs)),
        (r"/api/outputs/([0-9]+)", ItemsHandler,
         dict(items = appModel.outputs)),
        (r"/api/threads", ItemsHandler, 
         dict(items = appModel.threads)),
        (r"/api/threads/([0-9]+)", ItemsHandler,
         dict(items = appModel.threads)),
        (r"/api/views", ItemsHandler, 
         dict(items = appModel.views)),
        (r"/api/views/([0-9]+)", ItemsHandler,
         dict(items = appModel.views)),
        (r"/api/inputObservers", ItemsHandler, 
         dict(items = appModel.inputObservers)),
        (r"/api/inputObservers/([0-9]+)", ItemsHandler,
         dict(items = appModel.inputObservers)),
        (r"/api/parameterObservers", ItemsHandler, 
         dict(items = appModel.parameterObservers)),
        (r"/api/parameterObservers/([0-9]+)", ItemsHandler,
         dict(items = appModel.parameterObservers)),
        (r"/api/connectorValues/([0-9]+)", ItemsHandler,
         dict(items = appModel.connectorValues)),
        (r"/socket/error", SocketHandler, dict(items = appModel.errors)),
        (r"/socket/connectorValue", SocketHandler,
         dict(items = appModel.connectorValues)),
        (r"/download/(.*)", tornado.web.StaticFileHandler, {"path": filesDir}),
        (r"/(.*)", MainHandler)
    ]
    application = tornado.web.Application(handlers, template_path = staticDir)
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
    
def stop():
    ioLoop = tornado.ioloop.IOLoop.instance()
    ioLoop.add_callback_from_signal(ioLoop.stop)
