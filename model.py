# -*- coding: utf-8 -*-

import os

import stromx.runtime

class Files(object):
    def __init__(self, directory, streams):
        self.__directory = directory
        self.__streams = streams
        self.__files = {str(index): File(self, index, name) for index, name 
                        in enumerate(os.listdir(directory))}
        self.__index = len(self.__files)
                        
    @property
    def data(self):
        return {"files": [f.data for f in self.__files.values()]}
    
    @property
    def directory(self):
        return self.__directory
    
    @property
    def streams(self):
        return self.__streams
    
    def __getitem__(self, index):
        return self.__files[index]
        
    def delete(self, index):
        f = self[index]
        f.delete()
        self.__files.pop(index)
        
    def post(self, data):
        f = File(self, self.__index, data["file"]["name"])
        self.__files[f.index] = f
        self.__index += 1
        return f.data
    
    def put(self, index, data):
        f = self[index]
        return {"file": [f.put(data["file"])]}
        
class File(object):
    def __init__(self, files, index, name):
        self.__files = files
        self.__index = str(index)
        self.__name = name
        self.__opened = False
        self.__stream = None
        
    @property
    def data(self):
        streamIds = [self.__stream.index] if self.__stream else []
        return {"id": self.__index,
                "name": self.__name, 
                "content": "",
                "opened": self.__opened, 
                "stream": streamIds}
        
    @property
    def index(self):
        return self.__index

    def delete(self):
        path = os.path.join(self.__files.directory, self.__name)
        os.remove(path)
        
    def put(self, data):
        self.__opened = data.get("opened", self.__opened)
        
        if self.__opened:
            self.__stream = self.__files.streams.addStream(self)
        else:
            self.__stream = None
            
        return self.data
        
class Streams(object):
    def __init__(self):
        self.__streams = dict()
        self.__index = 0
        
    @property
    def data(self):
        return {"streams": [s.data for s in self.__streams.values()]}
    
    def __getitem__(self, index):
        return self.__streams[index]
        
    def addStream(self, streamFile):
        stream = Stream(self.__index, streamFile)
        self.__streams[stream.index] = stream
        self.__index += 1
        return stream
    
    def put(self, index, data):
        stream = self[index]
        return {"stream": [stream.put(data["stream"])]}
        
class Stream(object):
    def __init__(self, index, streamFile):
        self.__index = str(index)
        self.__name = ""
        self.__file = streamFile
        self.__active = False
        self.__paused = False
        
        factory = stromx.runtime.Factory()
        stromx.runtime.register(factory)
        
    @property
    def data(self):
        return {"id": self.__index,
                "name": self.__name,
                "active": self.__active,
                "paused": self.__paused,
                "file": self.__file.index}
        
    @property
    def index(self):
        return self.__index
    
    def put(self, data):
        self.__name = data.get("name", self.__name)
        self.__active = data.get("active", self.__active)
        self.__paused = data.get("paused", self.__paused)
        
        if not self.__active:
            self.__paused = False
            
        return self.data
        
