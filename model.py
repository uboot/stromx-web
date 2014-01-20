# -*- coding: utf-8 -*-

import base64
import datetime
import os
import re

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
        if os.path.exists(f.path):
            os.remove(f.path)
        self.__files.pop(index)
        
    def add(self, data):
        filename = data["file"]["name"]
        duplicates = [f for f in self.__files.values() if f.name == filename]
        assert(len(duplicates) <= 1)
        
        if len(duplicates):
            f = duplicates[0]
        else:         
            f = File(self, self.__index, data["file"]["name"])
        
        content = data["file"].get("content", "")
        content = re.sub("data:*;base64,", "", content, re.MULTILINE)
        if content != "":
            with file(f.path, 'w') as streamFile:
                streamFile.write(base64.decodestring(content))
        else:
            if os.path.exists(f.path):
                os.remove(f.path)
                
        self.__files[f.index] = f
        self.__index += 1
        return f.data
    
    def set(self, index, data):
        f = self[index]
        return {"file": [f.set(data["file"])]}
        
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
    
    @property
    def path(self):
        return os.path.join(self.__files.directory, self.__name)
    
    @property
    def name(self):
        return self.__name
        
    def set(self, data):
        self.__opened = data.get("opened", self.__opened)
        
        if self.__opened:
            self.__stream = self.__files.streams.add(self)
        else:
            self.__stream = None
            
        newName = data.get("name", self.name)
        if self.name != newName:
            newPath = os.path.join(self.__files.directory, newName)
            if os.path.exists(self.path):
                os.rename(self.path, newPath)
            self.__name = newName
            
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
        
    def add(self, streamFile):
        stream = Stream(self.__index, streamFile)
        self.__streams[stream.index] = stream
        self.__index += 1
        return stream
    
    def set(self, index, data):
        stream = self[index]
        return {"stream": [stream.set(data["stream"])]}
        
class Stream(object):
    def __init__(self, index, streamFile):
        self.__index = str(index)
        self.__file = streamFile
        self.__saved = True
        
        if os.path.exists(streamFile.path):
            factory = stromx.runtime.Factory()
            stromx.runtime.register(factory)
            reader = stromx.runtime.XmlReader()
            self.__stream = reader.readStream(streamFile.path, factory)
        else:
            self.__stream = stromx.runtime.Stream()
        
    @property
    def data(self):
        return {"id": self.__index,
                "name": self.name,
                "saved": self.saved,
                "active": self.active,
                "paused": self.paused,
                "file": self.__file.index}
        
    @property
    def index(self):
        return self.__index
        
    @property
    def active(self):
        status = self.__stream.status()
        return (status == stromx.runtime.Stream.Status.ACTIVE or
                status == stromx.runtime.Stream.Status.DEACTIVATING or
                status == stromx.runtime.Stream.Status.PAUSED)
        
    @active.setter
    def active(self, value):
        status = self.__stream.status()
        if value and status == stromx.runtime.Stream.Status.INACTIVE:
            self.__stream.start()
        
        if not value:
            self.__stream.stop()
            self.__stream.join()
        
    @property
    def paused(self):
        status = self.__stream.status()
        return status == stromx.runtime.Stream.Status.PAUSED
    
    @paused.setter
    def paused(self, value):
        if value and self.active:
            self.__stream.pause()
        
        status = self.__stream.status()
        if not value and status == stromx.runtime.Stream.Status.PAUSED:
            self.__stream.resume()
            
    @property
    def name(self):
        return self.__stream.name()
    
    @name.setter
    def name(self, value):
        if self.name != str(value):
            self.__stream.setName(str(value))
            self.__saved = False
        
    @property
    def saved(self):
        return self.__saved
    
    @saved.setter
    def saved(self, value):
        # it makes no sense to mark a clean (i.e. non-dirty) file as dirty
        if not value:
            return
        
        # the file should be saved
        if not self.saved:
            writer = stromx.runtime.XmlWriter()
            writer.writeStream(self.__file.path, self.__stream)
            self.__saved = True
    
    def set(self, data):
        self.name = data.get("name", self.name)
        self.active = data.get("active", self.active)
        self.paused = data.get("paused", self.paused)
        self.saved = data.get("saved", self.saved)
            
        return self.data
        
class Errors(object):
    def __init__(self):
        self.__errors = dict()
        self.__index = 0
        
    @property
    def data(self):
        return {"errors": [e.data for e in self.__errors.values()]}
    
    def __getitem__(self, index):
        return self.__errors[index]
        
    def add(self, description):
        error = Error(self.__index, description)
        self.__errors[error.index] = error
        self.__index += 1
        return error
    
    def clear(self):
        self.__errors.clear()
        
class Error(object):
    def __init__(self, index, description):
        self.__index = str(index)
        self.__time = datetime.datetime.now()
        self.__description = description
        
    @property
    def data(self):
        return {"id": self.__index,
                "time": self.__time.isoformat(),
                "description": self.__description}
        
    @property
    def index(self):
        return self.__index
        
        