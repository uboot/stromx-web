# -*- coding: utf-8 -*-

import base64
import datetime
import os
import re

import stromx.runtime 

class Items(object):
    def __init__(self):
        self.__items = dict()
        self.__index = 0
        
    @property
    def items(self):
        return self.__items
    
    @items.setter
    def items(self, value):
        self.__items = value
    
    def __getitem__(self, index):
        return self.__items[index]
    
    def set(self, index, data):
        obj = self[index]
        obj.set(data)
        return obj.data
    
    def addItem(self, item):
        item.index = self.__index
        self.__items[str(self.__index)] =  item
        self.__index += 1
    
    def addItems(self, items):
        for item in items:
            self.addItem(item)
            
    def deleteItem(self, index):
        self.__items.pop(index)
            
class Item(object):
    def __init__(self):
        self.__index = ""
        
    @property
    def index(self):
        return self.__index
    
    @index.setter
    def index(self, value):
        self.__index = str(value)
        
class Files(Items):
    def __init__(self, directory, streams):
        super(Files, self).__init__()
        self.__directory = directory
        self.__streams = streams
        files = [File(self, name) for name in os.listdir(directory)]
        self.addItems(files)
                        
    @property
    def data(self):
        return {"files": [f.data["file"] for f in self.items.values()]}
    
    @property
    def directory(self):
        return self.__directory
    
    @property
    def streams(self):
        return self.__streams
        
    def delete(self, index):
        f = self[index]
        if os.path.exists(f.path):
            os.remove(f.path)
        self.deleteItem(index)
        
    def add(self, data):
        filename = data["file"]["name"]
        duplicates = [f for f in self.items.values() if f.name == filename]
        assert(len(duplicates) <= 1)
        
        if len(duplicates):
            f = duplicates[0]
        else:         
            f = File(self, data["file"]["name"])
            self.addItem(f)
        
        content = data["file"].get("content", "")
        content = re.sub("data:*;base64,", "", content, re.MULTILINE)
        if content != "":
            with file(f.path, 'w') as streamFile:
                streamFile.write(base64.decodestring(content))
        else:
            if os.path.exists(f.path):
                os.remove(f.path)
                
        return f.data
        
class File(Item):
    def __init__(self, files, name):
        super(File, self).__init__()
        self.__files = files
        self.__name = name
        self.__opened = False
        self.__stream = None
        
    @property
    def data(self):
        streamIds = [self.__stream.index] if self.__stream else []
        return {"file":
                {"id": self.index,
                 "name": self.name, 
                 "content": "",
                 "opened": self.__opened, 
                 "stream": streamIds}}
    
    @property
    def path(self):
        return os.path.join(self.__files.directory, self.__name)
    
    @property
    def name(self):
        return self.__name
        
    def set(self, data):
        properties = data["file"]
        self.__opened = properties.get("opened", self.__opened)
        
        if self.__opened:
            self.__stream = self.__files.streams.add(self)
        else:
            self.__stream = None
            
        newName = properties.get("name", self.name)
        if self.name != newName:
            newPath = os.path.join(self.__files.directory, newName)
            if os.path.exists(self.path):
                os.rename(self.path, newPath)
            self.__name = newName
            
        return self.data
        
class Streams(Items):
    def __init__(self):
        super(Streams, self).__init__()
        
    @property
    def data(self):
        return {"streams": [s.data["stream"] for s in self.items.values()]}
        
    def add(self, streamFile):
        stream = Stream(streamFile)
        self.addItem(stream)
        return stream
        
class Stream(Item):
    def __init__(self, streamFile):
        self.__file = streamFile
        self.__saved = True
        
        if os.path.exists(streamFile.path):
            factory = stromx.runtime.Factory()
            stromx.runtime.register(factory)
            reader = stromx.runtime.XmlReader()
            try:
                self.__stream = reader.readStream(str(streamFile.path), factory)
            except stromx.runtime.Exception as e:
                errors.add(e)
        else:
            self.__stream = stromx.runtime.Stream()
        
    @property
    def data(self):
        return {"stream":
                {"id": self.index,
                 "name": self.name,
                 "saved": self.saved,
                 "active": self.active,
                 "paused": self.paused,
                 "file": self.__file.index}}
        
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
            try:
                self.__stream.start()
            except stromx.runtime.Exception as e:
                errors.add(e)
        
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
            try:
                writer.writeStream(self.__file.path, self.__stream)
                self.__saved = True
            except stromx.runtime.Exception as e:
                errors.add(e)
    
    def set(self, data):
        properties = data["stream"]
        self.name = properties.get("name", self.name)
        self.active = properties.get("active", self.active)
        self.paused = properties.get("paused", self.paused)
        self.saved = properties.get("saved", self.saved)
            
        return self.data

class Errors(Items):
    def __init__(self):
        super(Errors, self).__init__()
        self.__errorHandlers = []
        self.__index = 0
        
    @property
    def data(self):
        return {"errors": [e.data["error"] for e in self.items.values()]}
    
    @property
    def errorHandlers(self):
        return self.__errorHandlers
    
    @errorHandlers.setter
    def errorHandlers(self, value):
        self.__errorHandlers = value
        
    def add(self, description):
        error = Error(description)
        self.addItem(error)
        for handler in self.__errorHandlers:
            handler(error)
        return error
   
    def clear(self):
        self.items.clear()
        
class Error(Item):
    def __init__(self, description):
        self.__time = datetime.datetime.now()
        self.__description = str(description)
        
    @property
    def data(self):
        return {"error":
                {"id": self.index,
                 "time": self.__time.isoformat(),
                 "description": self.__description}}

errors = Errors()
        