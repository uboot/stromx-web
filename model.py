# -*- coding: utf-8 -*-

import base64
import datetime
import os
import re

import stromx.runtime 

class Model(object):
    def __init__(self, directory = ""):
        self.__files = Files(directory, self)
        self.__streams = Streams(self)
        self.__errors = Errors()
        self.__operators = Operators(self)
        self.__parameters = Parameters(self)
    
    @property
    def files(self):
        return self.__files
    
    @property
    def streams(self):
        return self.__streams
    
    @property
    def errors(self):
        return self.__errors
    
    @property
    def operators(self):
        return self.__operators
    
    @property
    def parameters(self):
        return self.__parameters
    
class Items(object):
    def __init__(self, model = None):
        self.__items = dict()
        self.__index = 0
        self.__model = model
        
    @property
    def data(self):
        name = self.__class__.__name__.lower()
        itemList = [item.data.values()[0] for item in self.items.values()]
        return {name: itemList}
        
    @property
    def model(self):
        return self.__model
        
    @property
    def items(self):
        return self.__items
    
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
        
    def delete(self, index):
        item = self.__items.pop(index)
        item.delete()
        
    def add(self, data):
        raise NotImplementedError()
            
class Item(object):
    properties = []
    
    def __init__(self, model = None):
        self.__index = ""
        self.__model = model
        
    @property
    def data(self):
        props = {prop: self.__getattribute__(prop) for prop in self.properties}
        props['id'] = self.index
        name = self.__class__.__name__.lower()
        return {name: props}
           
    @property
    def model(self):
        return self.__model
        
    @property
    def index(self):
        return self.__index
    
    @index.setter
    def index(self, value):
        self.__index = str(value)
        
    def set(self, data):
        raise NotImplementedError()
        
    def delete(self):
        pass
        
class Files(Items):
    @property
    def directory(self):
        return self.__directory
    
    def __init__(self, directory, model):
        super(Files, self).__init__(model)
        self.__directory = directory
        files = []
        if directory != "":
            files = [File(name, self.model) for name in os.listdir(directory)]
        self.addItems(files)
        
    def add(self, data):
        filename = data["file"]["name"]
        duplicates = [f for f in self.items.values() if f.name == filename]
        assert(len(duplicates) <= 1)
        
        if len(duplicates):
            f = duplicates[0]
        else:         
            f = File(data["file"]["name"], self.model)
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
    properties = ["content", "opened", "stream", "name"]
    
    def __init__(self, name, model):
        super(File, self).__init__(model)
        self.__name = name
        self.__opened = False
        self.__stream = None
    
    @property
    def opened(self):
        return self.__opened
    
    @opened.setter
    def opened(self, value):
        if self.__opened == value:
            return
        
        if value:
            try:
                self.__stream = self.model.streams.addFile(self)
                self.__opened = True
            except stromx.runtime.Exception as e:
                self.model.errors.addError(e)
        else:
            self.model.streams.delete(self.__stream.index)
            self.__stream = None
            self.__opened = False
    
    @property
    def stream(self):
        return [self.__stream.index] if self.__stream else []
    
    @property
    def content(self):
        return ""
    
    @property
    def path(self):
        return os.path.join(self.model.files.directory, self.__name)
    
    @property
    def name(self):
        return self.__name
    
    @name.setter
    def name(self, name):
        if self.__name != name:
            newPath = os.path.join(self.model.files.directory, name)
            if os.path.exists(self.path):
                os.rename(self.path, newPath)
            self.__name = name
        
    def delete(self):
        self.opened = False
        if os.path.exists(self.path):
            os.remove(self.path)
        
    def set(self, data):
        properties = data["file"]
        self.opened = properties.get("opened", self.opened)
        self.name = properties.get("name", self.name)
            
        return self.data
        
class Streams(Items):
    def __init__(self, model):
        super(Streams, self).__init__(model)
        
    def addFile(self, streamFile):
        stream = Stream(streamFile, self.model)
        self.addItem(stream)
        return stream
        
class Stream(Item):
    properties = ["name", "saved", "active", "paused", "file", "operators"]
    
    def __init__(self, streamFile, model):
        super(Stream, self).__init__(model)
        self.__file = streamFile
        self.__saved = True
        self.__operators = []
        
        if os.path.exists(streamFile.path):
            factory = stromx.runtime.Factory()
            stromx.runtime.register(factory)
            reader = stromx.runtime.XmlReader()
            self.__stream = reader.readStream(str(streamFile.path), factory)
        else:
            self.__stream = stromx.runtime.Stream()
            
        for op in self.__stream.operators():
            self.__operators.append(self.model.operators.addStromxOp(op))
        
    @property
    def file(self):
        return self.__file.index
    
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
                self.model.errors.addError(e)
        
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
                self.model.errors.addError(e)
    
    @property
    def operators(self):
        return [op.index for op in self.__operators]
    
    def set(self, data):
        properties = data["stream"]
        self.name = properties.get("name", self.name)
        self.active = properties.get("active", self.active)
        self.paused = properties.get("paused", self.paused)
        self.saved = properties.get("saved", self.saved)
            
        return self.data
    
    def delete(self):
        for op in self.__operators:
            self.model.operators.delete(op.index)
        
class Operators(Items):
    def addStromxOp(self, op):
        operator = Operator(op, self.model)
        self.addItem(operator)
        return operator
    
class Operator(Item):
    properties = ["name", "status", "type", "package", "version", "parameters"]
    
    def __init__(self, op, model):
        super(Operator, self).__init__(model)
        self.__op = op
        self.__parameters = []
        for param in self.__op.info().parameters():
            parameter = self.model.parameters.addStromxParameter(param)
            self.__parameters.append(parameter)
        
    @property
    def name(self):
        return self.__op.name()
    
    @name.setter
    def name(self, value):
        self.__op.setName(value)
        
    @property
    def status(self):
        if self.__op.status() == stromx.runtime.Operator.Status.NONE:
            return 'none'
        elif self.__op.status() == stromx.runtime.Operator.Status.INITIALIZED:
            return 'initialized'
        elif self.__op.status() == stromx.runtime.Operator.Status.ACTIVE:
            return 'active'
        else:
            return 'undefined'
        
    @property
    def type(self):
        return self.__op.info().type()
        
    @property
    def package(self):
        return self.__op.info().package()
        
    @property
    def version(self):
        version = self.__op.info().version()
        return '{0}.{1}.{2}'.format(version.major(), version.minor(),
                                    version.revision())
        
    @property
    def parameters(self):
        return [op.index for op in self.__parameters]
        
    def set(self, data):
        properties = data["operator"]
        self.name = properties.get("name", self.name)
            
        return self.data
    
class Parameters(Items):
    def addStromxParameter(self, param):
        parameter = Parameter(param, self.model)
        self.addItem(parameter)
        return parameter
    
class Parameter(Item):
    def __init__(self, param, model):
        super(Parameter, self).__init__(model)
        self.__param = param
        
class Errors(Items):
    def __init__(self):
        super(Errors, self).__init__()
        self.__errorHandlers = []
    
    @property
    def errorHandlers(self):
        return self.__errorHandlers
    
    @errorHandlers.setter
    def errorHandlers(self, value):
        self.__errorHandlers = value
        
    def addError(self, description):
        error = Error(description)
        self.addItem(error)
        for handler in self.__errorHandlers:
            handler(error)
        return error
   
    def clear(self):
        self.items.clear()
        
class Error(Item):
    properties = ["time", "description"]
    
    def __init__(self, description):
        super(Error, self).__init__()
        self.__time = datetime.datetime.now()
        self.__description = str(description)
        
    @property
    def time(self):
        return self.__time.isoformat()
    
    @property
    def description(self):
        return self.__description

        