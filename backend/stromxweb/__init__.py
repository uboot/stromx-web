# -*- coding: utf-8 -*-

import httplib
import mimetypes
import os
import re
import tornado.auth
import tornado.escape
import tornado.httpserver
import tornado.ioloop
import tornado.log
import tornado.web
import tornado.websocket
import traceback

import model
from error import Failed

config = {}
_USER_COOKIE = 'USER'
_MAX_SOCKET_QUEUE_LENGTH = 5
      
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        if not config['LOGIN_SERVICE']:
            return True
            
        user_json = self.get_secure_cookie(_USER_COOKIE)
        if not user_json: return None
        return tornado.escape.json_decode(user_json)
        
class AuthHandler(BaseHandler, tornado.auth.GoogleOAuth2Mixin):
    @tornado.gen.coroutine
    def get(self):
        if self.get_argument('code', False):
            user = yield self.get_authenticated_user(
                redirect_uri='https://' + config['HOST'] + '/auth/google',
                code=self.get_argument('code'))
            # Save the user with e.g. set_secure_cookie
            self.set_secure_cookie(_USER_COOKIE,
                                   tornado.escape.json_encode(user))
            self.redirect('https://' + config['HOST'])
        else:
            yield self.authorize_redirect(
                redirect_uri='https://' + config['HOST'] + '/auth/google',
                client_id=self.settings['google_oauth']['key'],
                scope=['profile', 'email'],
                response_type='code',
                extra_params={'approval_prompt': 'auto'})

class LoginHandler(BaseHandler):
    def get(self):
        loginUrl = ''
        if config['LOGIN_SERVICE']:
            loginUrl = "/auth/" + config['LOGIN_SERVICE']
        self.render("login.html", loginUrl = loginUrl,
                                  trackerId=config['GOOGLE_TRACKER_ID'])

class LogoutHandler(BaseHandler):
    def get(self):
        # This logs the user out of this demo app, but does not log them
        # out of Google.  Since Google remembers previous authorizations,
        # returning to this app will log them back in immediately with no
        # interaction (unless they have separately logged out of Google in
        # the meantime).
        self.clear_cookie(_USER_COOKIE)
        self.render("logout.html", trackerId=config['GOOGLE_TRACKER_ID'])

class ItemsHandler(BaseHandler):
    # FIXME: disable cross-origin connections by removing the function below
    def set_default_headers(self):
        # ember server runs on port 4200
        self.set_header('Access-Control-Allow-Origin', 'http://0.0.0.0:4200')
    
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
        
    @tornado.web.authenticated
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
            traceback.print_exc()
            self.set_status(httplib.NOT_FOUND)
        except Failed:
            traceback.print_exc()
            self.set_status(httplib.BAD_REQUEST)
    
    @tornado.web.authenticated
    def put(self, index):
        try:
            data = tornado.escape.json_decode(self.request.body)
            item = self.items.set(index, data)
            json = tornado.escape.json_encode(item)
            self.write(json)  
        except KeyError:
            traceback.print_exc()
            self.set_status(httplib.NOT_FOUND)
        except Failed:
            traceback.print_exc()
            self.set_status(httplib.BAD_REQUEST)
        
    @tornado.web.authenticated
    def post(self):
        try:
            data = tornado.escape.json_decode(self.request.body)
            item = self.items.addData(data)
            json = tornado.escape.json_encode(item)
            self.write(json) 
        except Failed:
            traceback.print_exc()
            self.set_status(httplib.BAD_REQUEST)
    
    @tornado.web.authenticated
    def delete(self, index):
        try:
            self.items.delete(index)
            self.write("null")
        except KeyError:
            traceback.print_exc()
            self.set_status(httplib.NOT_FOUND)
        except Failed:
            traceback.print_exc()
            self.set_status(httplib.BAD_REQUEST)
           
class SocketHandler(tornado.websocket.WebSocketHandler, BaseHandler):
    def initialize(self, items):
        self.__items = items
        self.__queueLength = 0
        
    def doSend(self, json):
        if self.__queueLength > _MAX_SOCKET_QUEUE_LENGTH:
            return
            
        try:
            self.write_message(json)
            self.__queueLength += 1
        except tornado.websocket.WebSocketClosedError:
            pass
        
    def sendValue(self, value):
        loop = tornado.ioloop.IOLoop.instance()
        try:
            json = tornado.escape.json_encode(value.data)
            loop.add_callback(lambda: self.doSend(json))
        except Failed:
            traceback.print_exc()
    
    def open(self):
        user_json = self.get_current_user()
        if not user_json: 
            self.close()
            return
            
        self.__items.addHandler(self.sendValue)
    
    def on_close(self):
        self.__items.removeHandler(self.sendValue)
    
    def on_message(self, message):
        self.__queueLength -= 1
        assert (self.__queueLength >= 0)
        
    # FIXME: disable cross-origin websocket connections by removing the function
    # below
    def check_origin(self, origin):
        return True

class MainHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, _):
        self.render("index.html", trackerId=config['GOOGLE_TRACKER_ID'])
        
class RedirectHandler(tornado.web.RequestHandler):
    def get(self, _):
        self.redirect('https://' + config['HOST'])
        
def start(configFile):
    #tornado.log.enable_pretty_logging()
    execfile(configFile, config) 
    
    appModel = model.Model(config['DATA_DIR'])
    appModel.executionDelay = config['EXECUTION_DELAY']
    serverDir = os.path.dirname(os.path.abspath(__file__))
    staticDir = os.path.join(serverDir, "static")
    assetsDir = os.path.join(staticDir, "assets")
    fontsDir = os.path.join(staticDir, "fonts")
    
    handlers = [
        (r"/auth/google", AuthHandler),
        (r"/auth/login", LoginHandler),
        (r"/auth/logout", LogoutHandler),
        (r"/assets/(.*)", tornado.web.StaticFileHandler, {"path": assetsDir}),
        (r"/fonts/(.*)", tornado.web.StaticFileHandler, {"path": fontsDir}),
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
        (r"/api/views", ItemsHandler, 
         dict(items = appModel.views)),
        (r"/api/views/([0-9]+)", ItemsHandler,
         dict(items = appModel.views)),
        (r"/api/inputObservers", ItemsHandler, 
         dict(items = appModel.inputObservers)),
        (r"/api/inputObservers/([0-9]+)", ItemsHandler,
         dict(items = appModel.inputObservers)),
        (r"/api/outputObservers", ItemsHandler, 
         dict(items = appModel.outputObservers)),
        (r"/api/outputObservers/([0-9]+)", ItemsHandler,
         dict(items = appModel.outputObservers)),
        (r"/api/parameterObservers", ItemsHandler, 
         dict(items = appModel.parameterObservers)),
        (r"/api/parameterObservers/([0-9]+)", ItemsHandler,
         dict(items = appModel.parameterObservers)),
        (r"/api/connectorValues/([0-9]+)", ItemsHandler,
         dict(items = appModel.connectorValues)),
        (r"/socket/error", SocketHandler, dict(items = appModel.errors)),
        (r"/socket/connectorValue", SocketHandler,
         dict(items = appModel.connectorValues)),
        (r"/download/(.*)", tornado.web.StaticFileHandler,
         {"path": config['DATA_DIR']}),
        (r"/(.*)", MainHandler)
    ]
        
    settings = dict(
        cookie_secret = config['COOKIE_SECRET'],
        google_oauth = {"key": config['GOOGLE_OAUTH_KEY'],
                        "secret":config['GOOGLE_OAUTH_SECRET']},
        login_url = "/auth/login",
        template_path = staticDir
    )
    
    # FIXME: Redirect standard ports to the ports below
    # iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
    # iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443

    if config['SECURE_SERVER']:
        # serve the application with https
        application = tornado.web.Application(handlers, **settings)
        server = tornado.httpserver.HTTPServer(application, ssl_options = {
          'certfile': config['CERT_FILE'],
          'keyfile': config['KEY_FILE']
        })
        server.listen(8443)
        
        # redirect all http requests to https
        redirect = tornado.web.Application([
            (r"/(.*)", RedirectHandler)
        ])
        redirect.listen(8080)
    else:
        # serve the application with http
        application = tornado.web.Application(handlers, **settings)
        application.listen(8080)
    
    tornado.ioloop.IOLoop.instance().start()
    
def stop():
    ioLoop = tornado.ioloop.IOLoop.instance()
    ioLoop.add_callback_from_signal(ioLoop.stop)