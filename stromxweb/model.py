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
        self.__enumDescriptions = EnumDescriptions(self)
        self.__outputs = Outputs(self)
        self.__inputs = Inputs(self)
        self.__threads = Threads(self)
    
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
    
    @property
    def enumDescriptions(self):
        return self.__enumDescriptions
    
    @property
    def inputs(self):
        return self.__inputs
    
    @property
    def outputs(self):
        return self.__outputs
    
    @property
    def threads(self):
        return self.__threads
    
class Items(object):
    def __init__(self, model = None):
        self.__items = dict()
        self.__index = 0
        self.__model = model
        
    @property
    def data(self):
        name = _resourceName(self.__class__.__name__)
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
    
    def __len__(self):
        return len(self.__items)
    
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
        
    def addData(self, data):
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
        name = _resourceName(self.__class__.__name__)
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
        name = _resourceName(self.__class__.__name__)
        properties = data[name]
        
        for key in properties:
            try:
                self.__setattr__(key, properties[key])
            except AttributeError:
                pass
            
        return self.data
        
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
            files = [File(name, self.model) for name
                     in sorted(os.listdir(directory))]
        self.addItems(files)
        
    def addData(self, data):
        filename = data["file"]["name"]
        duplicates = [f for f in self.items.values() if f.name == filename]
        assert(len(duplicates) <= 1)
        
        if len(duplicates):
            f = duplicates[0]
        else:         
            f = File(data["file"]["name"], self.model)
            self.addItem(f)
        
        content = data["file"].get("content", "")
        content = re.sub("data:.*;base64,", "", content, re.MULTILINE)
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
        
class Streams(Items):
    @property
    def factory(self):
        return self.__factory
    
    def __init__(self, model):
        super(Streams, self).__init__(model)
        
        self.__factory = stromx.runtime.Factory()
        stromx.runtime.register(self.__factory)
        
        _registerExtraPackages(self.__factory)
        
    def addFile(self, streamFile):
        stream = Stream(streamFile, self.__factory, self.model)
        self.addItem(stream)
        return stream
        
class Stream(Item):
    properties = ["name", "saved", "active", "paused", "file", "operators"]
    
    def __init__(self, streamFile, factory, model):
        super(Stream, self).__init__(model)
        self.__file = streamFile
        self.__saved = False
        self.__operators = []
        
        if os.path.exists(streamFile.path):
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
        
    @property
    def saved(self):
        return self.__saved
    
    @saved.setter
    def saved(self, value):
        # it makes no sense to mark a clean (i.e. non-dirty) file as dirty
        if not value:
            return
        
        # the file should be saved
        writer = stromx.runtime.XmlWriter()
        try:
            writer.writeStream(str(self.__file.path), self.__stream)
            self.__saved = True
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
    
    @property
    def operators(self):
        return [op.index for op in self.__operators]
    
    def delete(self):
        for op in self.__operators:
            self.model.operators.delete(op.index)
        
class Operators(Items):
    def addStromxOp(self, op):
        operator = Operator(op, self.model)
        self.addItem(operator)
        return operator
        
class Operator(Item):
    properties = ["name", "status", "type", "package", "version", "parameters",
                  "x", "y"]
    
    def __init__(self, op, model):
        super(Operator, self).__init__(model)
        self.__op = op
        self.__parameters = []
        for param in self.__op.info().parameters():
            if not _parameterIsReadable(op, param):
                continue
            
            parameter = self.model.parameters.addStromxParameter(self.__op,
                                                                 param)
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
    def x(self):
        return self.__op.position().x()
    
    @x.setter
    def x(self, value):
        pos = self.__op.position()
        pos.setX(value)
        self.__op.setPosition(pos)
    
    @property
    def y(self):
        return self.__op.position().y()
    
    @y.setter
    def y(self, value):
        pos = self.__op.position()
        pos.setY(value)
        self.__op.setPosition(pos)
        
    @property
    def parameters(self):
        return [op.index for op in self.__parameters]
    
    @property
    def stromxOp(self):
        return self.__op
    
class Parameters(Items):
    def addStromxParameter(self, op, param):
        parameter = Parameter(op, param, self.model)
        self.addItem(parameter)
        return parameter
    
class Parameter(Item):
    properties = ['title', 'type', 'stringValue', 'numberValue', 'minimum',
                  'maximum', 'writable', 'descriptions', 'state']
    
    def __init__(self, op, param, model):
        super(Parameter, self).__init__(model)
        self.__param = param
        self.__op = op
        self.__state = 'current'
        self.__descriptions = []
        for desc in self.__param.descriptions():
            if not _parameterIsReadable(op, param):
                continue
            
            description = (
                self.model.enumDescriptions.addStromxEnumDescription(desc)
            )
            self.__descriptions.append(description)
        
    @property
    def state(self):
        return self.__state
    
    @property
    def title(self):
        return self.__param.title()
    
    @property
    def type(self):
        variant = self.__param.variant()
        return _variantToType(variant)
        
    @property
    def stringValue(self):
        variant = self.__param.variant()
        if not _hasStringRepresentation(variant):
            return ''
        
        return self.__getParameter(variant)
        
    @stringValue.setter
    def stringValue(self, value):
        assert(type(value) == str or type(value) == unicode)
        variant = self.__param.variant()
        if not _isString(variant):
            return
        data = _toStromxData(variant, str(value))
        self.__setParameter(data)
        
    @property
    def numberValue(self):
        variant = self.__param.variant()
        if not _isNumber(variant):
            return 0
        
        return self.__getParameter(variant)
        
    @numberValue.setter
    def numberValue(self, value):
        assert(type(value) == float or type(value) == int)
        variant = self.__param.variant()
        if not _isNumber(variant):
            return
        data = _toStromxData(variant, value)
        self.__setParameter(data)
        
    @property
    def minimum(self):
        variant = self.__param.variant()
        if not _isNumber(variant):
            return 0
        
        data = self.__param.min()
        value = _toPythonValue(variant, data)
        if value == None:
            return 0
        return value
        
    @property
    def maximum(self):
        variant = self.__param.variant()
        if not _isNumber(variant):
            return 0
        
        data = self.__param.max()
        value = _toPythonValue(variant, data)
        if value == None:
            return 0
        return value
    
    @property
    def writable(self):
        return _parameterIsWritable(self.__op, self.__param)
        
    @property
    def descriptions(self):
        return [desc.index for desc in self.__descriptions]
        return self.__descriptions
    
    def __getParameter(self, variant):
        try:
            data = self.__op.getParameter(self.__param.id())
            self.__state = 'current'
            value = _toPythonValue(variant, data)
        except stromx.runtime.Exception as e:
            self.__state = 'accessFailed'
            value = ''
            self.model.errors.addError(e)
        return value
        
    def __setParameter(self, data):
        if data == None:
            return
            
        try:
            self.__op.setParameter(self.__param.id(), data)
        except stromx.runtime.Exception as e:
            self.model.errors.addError(e)
    
class EnumDescriptions(Items):
    def addStromxEnumDescription(self, desc):
        description = EnumDescription(desc, self.model)
        self.addItem(description)
        return description
    
class EnumDescription(Item):
    properties = ['value', 'title']
    
    def __init__(self, desc, model):
        super(EnumDescription, self).__init__(model)
        self.__desc = desc
        
    @property
    def value(self):
        return self.__desc.value().get()
    
    @property
    def title(self):
        return self.__desc.title()
    
class Input(Item):
    properties = ['title', 'operator', 'position', 'sourceOperator',
                  'sourcePosition']
    
    def __init__(self, op, pos, sourceOp, sourcePos, model):
        super(Input, self).__init__(model)
        self.__op = op
        self.__pos = pos
        self.__sourcePos = sourcePos
        self.__sourceOp = sourceOp
        
    @property
    def title(self):
        return self.__input.title()
    
    @property
    def operator(self):
        return self.__op.index
    
    @property
    def position(self):
        return self.__pos
    
    @property
    def sourceOperator(self):
        if self.__sourceOp != None:
            return [self.__sourceOp.index]
        else:
            return []
    
    @property
    def sourcePosition(self):
        return self.__sourcePos
    
    @property
    def __input(self):
        return self.__op.stromxOp.info().inputs()[self.__pos]
        
class Inputs(Items):
    def addStromxInput(self, op, pos, sourceOp = None, sourcePos = -1):
        inputModel = Input(op, pos, sourceOp, sourcePos, self.model)
        self.addItem(inputModel)
        return inputModel
    
class Thread(Item):
    properties = ['name', 'color']
    
    def __init__(self, stromxThread, model):
        super(Thread, self).__init__(model)
        self.__thread = stromxThread
    
    @property
    def name(self):
        return self.__thread.name()
    
    @property
    def color(self):
        color = self.__thread.color()
        return '#{0:02x}{1:02x}{2:02x}'.format(color.r(), color.g(), color.b())
        
class Threads(Items):
    def addStromxThread(self, thread):
        threadModel = Thread(thread, self.model)
        self.addItem(threadModel)
        return threadModel
    
class Output(Item):
    properties = ['title', 'operator', 'position']
    
    def __init__(self, op, pos, model):
        super(Output, self).__init__(model)
        self.__op = op
        self.__pos = pos
        
    @property
    def title(self):
        return self.__output.title()
    
    @property
    def operator(self):
        return self.__op.index
    
    @property
    def position(self):
        return self.__pos
    
    @property
    def __output(self):
        return self.__op.stromxOp.info().outputs()[self.__pos]
        
class Outputs(Items):
    def addStromxOutput(self, op, position):
        output = Output(op, position, self.model)
        self.addItem(output)
        return output
        
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
    
def _resourceName(name):
    if len(name) == 0:
        return name
    else:
        return name[0].lower() + name[1:]

def _parameterIsReadable(op, param):
    status = op.status()
    accessMode = param.accessMode()
    
    AccessMode = stromx.runtime.Parameter.AccessMode
    Status = stromx.runtime.Operator.Status
    
    if accessMode == AccessMode.NONE_READ:
        return True
    elif accessMode == AccessMode.NONE_WRITE:
        return True
    elif accessMode == AccessMode.INITIALIZED_READ and status != Status.NONE:
        return True
    elif accessMode == AccessMode.INITIALIZED_WRITE and status != Status.NONE:
        return True
    elif accessMode == AccessMode.ACTIVATED_WRITE and status != Status.NONE:
        return True
    else:
        return False

def _parameterIsWritable(op, param):
    status = op.status()
    accessMode = param.accessMode()
    
    AccessMode = stromx.runtime.Parameter.AccessMode
    Status = stromx.runtime.Operator.Status
    
    if accessMode == AccessMode.NONE_WRITE and status == Status.NONE:
        return True
    elif (accessMode == AccessMode.INITIALIZED_WRITE and 
          status == Status.INITIALIZED):
        return True
    elif accessMode == AccessMode.ACTIVATED_WRITE and status != Status.NONE:
        return True
    else:
        return False
    
def _isNumber(variant):
    if variant.isVariant(stromx.runtime.DataVariant.INT):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return True
    else:
        return False
    
def _isString(variant):
    if variant.isVariant(stromx.runtime.DataVariant.STRING):
        return True
    else:
        return False
    
def _hasStringRepresentation(variant):
    if variant.isVariant(stromx.runtime.DataVariant.STRING):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return True
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return True
    else:
        return False
    
def _toPythonValue(variant, data):
    if data.variant().isVariant(stromx.runtime.DataVariant.NONE):
        return None
    
    if variant.isVariant(stromx.runtime.DataVariant.INT):
        return int(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.FLOAT):
        return float(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return bool(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.STRING):
        return str(data.get())
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return 0
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return "{0} x {1}".format(data.width(), data.height())
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return "{0} x {1}".format(data.rows(), data.cols())
    else:
        return 0
       
def _toStromxData(variant, value):
    if variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return stromx.runtime.Bool(bool(value))
    elif variant.isVariant(stromx.runtime.DataVariant.ENUM):
        return stromx.runtime.Enum(value)
    elif variant.isVariant(stromx.runtime.DataVariant.UINT_8):
        return stromx.runtime.UInt8(value)
    elif variant.isVariant(stromx.runtime.DataVariant.UINT_16):
        return stromx.runtime.UInt16(value)
    elif variant.isVariant(stromx.runtime.DataVariant.UINT_32):
        return stromx.runtime.UInt32(value)
    elif variant.isVariant(stromx.runtime.DataVariant.INT_8):
        return stromx.runtime.Int8(value)
    elif variant.isVariant(stromx.runtime.DataVariant.INT_16):
        return stromx.runtime.Int16(value)
    elif variant.isVariant(stromx.runtime.DataVariant.INT_32):
        return stromx.runtime.Int32(value)
    elif variant.isVariant(stromx.runtime.DataVariant.FLOAT_32):
        return stromx.runtime.Float32(value)
    elif variant.isVariant(stromx.runtime.DataVariant.FLOAT_64):
        return stromx.runtime.Float64(value)
    elif variant.isVariant(stromx.runtime.DataVariant.STRING):
        return stromx.runtime.String(value)
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return stromx.runtime.TriggerData()
    else:
        return None
    
def _variantToType(variant):
    if variant.isVariant(stromx.runtime.DataVariant.FLOAT):
        return 'float'
    elif variant.isVariant(stromx.runtime.DataVariant.TRIGGER):
        return 'trigger'
    elif variant.isVariant(stromx.runtime.DataVariant.ENUM):
        return 'enum'
    elif variant.isVariant(stromx.runtime.DataVariant.INT):
        return 'int'
    elif variant.isVariant(stromx.runtime.DataVariant.BOOL):
        return 'bool'
    elif variant.isVariant(stromx.runtime.DataVariant.STRING):
        return 'string'
    elif variant.isVariant(stromx.runtime.DataVariant.IMAGE):
        return 'image'
    elif variant.isVariant(stromx.runtime.DataVariant.MATRIX):
        return 'matrix'
    else:
        return 'none'

def _registerExtraPackages(factory):
        try:
            import stromx.cvsupport as cvsupport
            cvsupport.register(factory)
        except ImportError:
            pass
        
        try:
            import stromx.cvimgproc as cvimgproc
            cvimgproc.register(factory)
        except ImportError:
            pass
        
        try:
            import stromx.cvcore as cvcore
            cvcore.register(factory)
        except ImportError:
            pass
        
        try:
            import stromx.cvhighgui as cvhighgui
            cvhighgui.register(factory)
        except ImportError:
            pass
        
        try:
            import stromx.raspi as raspi
            raspi.register(factory)
        except ImportError:
            pass
        